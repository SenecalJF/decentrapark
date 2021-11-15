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
      assert.equal(ev._rentPrice.toNumber(), 10);
      assert.equal(ev._parkingPrice.toNumber(), 500);
      return id == ev.parkingID;
    });
  });

  it('add a second parking spot', async () => {
    const instance = await Decentrapark.deployed();

    let result = await instance.addParkingSpot(accounts[5], 15, 10000, { from: accounts[5] });
    id += 1;
    truffleAssert.eventEmitted(result, 'ParkingAdded', (ev) => {
      assert.equal(ev._owner, accounts[5]);
      assert.equal(ev._rentPrice.toNumber(), 15);
      assert.equal(ev._parkingPrice.toNumber(), 10000);
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

  it('get rent time by index', async () => {
    let instance = await Decentrapark.deployed();
    let result = await instance.getRentTimeByIndex(0);

    assert.equal(500, result.toNumber());
  });
});
