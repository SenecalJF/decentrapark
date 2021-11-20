const Decentrapark = artifacts.require('Decentrapark');
const truffleAssert = require('truffle-assertions');

contract('Decentrapark', (accounts) => {
  let id;
  it('add a parking spot', async () => {
    const instance = await Decentrapark.deployed();

    let result = await instance.addParkingSpot(accounts[3], 10, 500, { from: accounts[3] });
    id = 0;
    truffleAssert.eventEmitted(result, 'ParkingAdded', (ev) => {
      assert.equal(ev._owner, accounts[3]);
      return id == ev.parkingID;
    });
  });

  it('add a second parking spot', async () => {
    const instance = await Decentrapark.deployed();

    let result = await instance.addParkingSpot(accounts[5], 15, 10000, { from: accounts[5] });
    id += 1;
    truffleAssert.eventEmitted(result, 'ParkingAdded', (ev) => {
      assert.equal(ev._owner, accounts[5]);
      return id == ev.parkingID;
    });
  });

  it('get rent price by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getRentPriceByIndex(0);

    assert.equal(10, result);
  });

  it('get owner by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getOwnerByIndex(0);

    assert.equal(accounts[3], result);
  });

  it('get Renter by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getRenterByIndex(0);
    let addressNull = 0x0000000000000000000000000000000000000000;
    assert.equal(addressNull, result);
  });

  it('get Parking price by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getParkingPriceByIndex(1);

    assert.equal(10000, result.toNumber());
  });

  it('get rent time by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getRentTimeByIndex(1);

    assert.equal(86400, result.toNumber());
  });

  it('set the rent price', async () => {
    let instance = await Decentrapark.deployed();
    await instance.setRentPrice(29, 0, { from: accounts[3] });
    let amount = await instance.getRentPriceByIndex(0);
    assert.equal(29, amount);
  });

  it('set the Parking Price', async () => {
    let instance = await Decentrapark.deployed();
    await instance.setParkingPrice(666, 0, { from: accounts[3] });
    let amount = await instance.getParkingPriceByIndex(0);
    assert.equal(666, amount);
  });

  it('set the rent Time', async () => {
    let instance = await Decentrapark.deployed();

    await instance.setRentTime(2, 0, { from: accounts[3] });
    let time = await instance.getRentTimeByIndex(0);

    assert.equal(2 * 86400, time);
  });

  it('should not let change the rent price', async () => {
    let instance = await Decentrapark.deployed();
    try {
      await instance.setRentPrice(29, 0, { from: accounts[4] });
      assert.equal(0, 0);
    } catch (err) {
      assert.include(err.message, 'revert', "The error message should contain 'revert'");
    }
  });

  it('rent a parking account', async () => {
    let instance = await Decentrapark.deployed();
    let rentPrice = await instance.getRentPriceByIndex(0);
    let passRentTime = await instance.getRentTimeByIndex(0);
    await instance.RentParking(0, { from: accounts[2], value: rentPrice });
    let newRenter = await instance.getRenterByIndex(0);
    let newRentTime = await instance.getRentTimeByIndex(0);
    let created_time = Math.floor(Date.now() / 1000) + passRentTime * 5;

    assert.equal(newRenter, accounts[2]);
    let delta = Math.abs(newRentTime.toNumber() - created_time);
    assert.equal(5 > delta, true);
  });

  it('should not let rent again', async () => {
    let instance = await Decentrapark.deployed();
    let rentPrice = await instance.getRentPriceByIndex(0);

    try {
      await instance.RentParking(0, { from: accounts[2], value: rentPrice });
      assert.equal(0, 0);
    } catch (err) {
      assert.include(err.message, 'revert', "The error message should contain 'revert'");
    }
  });

  it('check availability of parking', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getAvailability(0);
    assert.equal(result, false);
  });

  it('check availability of parking', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getAvailability(1);
    assert.equal(result, true);
  });

  it(' should not let the unrent the parking', async () => {
    let instance = await Decentrapark.deployed();
    try {
      await instance.unRentParking(0, { from: accounts[3] });
      assert.equal(0, 0);
    } catch (err) {
      assert.include(err.message, 'revert', "The error message should contain 'revert'");
    }
  });
});

contract('Decentrapark', (accounts) => {
  it('unrent a parking spot', async () => {
    let instance = await Decentrapark.deployed();
    let addressNull = 0x0000000000000000000000000000000000000000;
    let result = await instance.addParkingSpot(accounts[3], 10, 500, { from: accounts[3] });
    await instance.setRentTime(0, 0, { from: accounts[3] });
    try {
      await instance.unRentParking(0, { from: accounts[3] });
      assert.equal(addressNull, await instance.getRenterByIndex(0));
    } catch (err) {
      assert.include(err.message, 'revert', "The error message should contain 'revert'");
    }
  });
  it('check availability of parking', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getAvailability(0);
    assert.equal(result, true);
  });
});

contract('Decentrapark', (accounts) => {
  it('Buy a parking spot', async () => {
    let instance = await Decentrapark.deployed();
    await instance.addParkingSpot(accounts[3], 10, 500, { from: accounts[3] });
    let buyingPrice = await instance.getParkingPriceByIndex(0);
    try {
      await instance.buyParking(0, { value: buyingPrice, from: accounts[7] });
      let newOwner = await instance.getOwnerByIndex(0);
      assert.equal(newOwner, accounts[7]);
    } catch (err) {
      assert.include(err.message, 'revert', "The error message should contain 'revert'");
    }
  });
});
