// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//TODO : add a modifier to have an index in the range of 0 to parkings.lenght -1
contract Decentrapark {
  Parking[] public parkings;

  struct Parking {
    address owner;
    address renter;
    uint256 rentPrice;
    uint256 parkingPrice;
    uint256 rentTime;
  }

  address private nullAddress = 0x0000000000000000000000000000000000000000;

  event ParkingAdded(address _owner, uint256 parkingID);

  modifier validId(uint256 _indexParking) {
    require(_indexParking < parkings.length, 'Invalid parking ID');
    _;
  }

  modifier ownerOnly(uint256 _indexParking) {
    require(getOwnerByIndex(_indexParking) == msg.sender, 'You are not the owner of this parking');
    _;
  }

  function addParkingSpot(
    address _owner,
    uint256 _rentPrice,
    uint256 _ParkingPrice
  ) external {
    parkings.push(Parking(_owner, nullAddress, _rentPrice, _ParkingPrice, 1 days));
    emit ParkingAdded(msg.sender, parkings.length - 1);
  }

  function setRentPrice(uint256 _rentPrice, uint256 _indexParking)
    public
    payable
    validId(_indexParking)
    ownerOnly(_indexParking)
  {
    parkings[_indexParking].rentPrice = _rentPrice;
  }

  function setParkingPrice(uint256 _parkingPrice, uint256 _indexParking)
    public
    payable
    validId(_indexParking)
    ownerOnly(_indexParking)
  {
    parkings[_indexParking].parkingPrice = _parkingPrice;
  }

  function setRentTime(uint256 _rentTime, uint256 _indexParking)
    public
    payable
    validId(_indexParking)
    ownerOnly(_indexParking)
  {
    parkings[_indexParking].rentTime = _rentTime * 1 days;
  }

  function RentParking(uint256 _indexParking) public payable validId(_indexParking) {
    uint256 _rentPrice = getRentPriceByIndex(_indexParking);
    require(getRenterByIndex(_indexParking) != msg.sender, 'You are already renting the parking');
    require(getRenterByIndex(_indexParking) != getOwnerByIndex(_indexParking), "You can't rent your own parking");
    require(getAvailability(_indexParking) == true, 'The parking is already in use');
    require(msg.value == _rentPrice, "The amount send doesn't correspond to the renting price");

    (bool sent, ) = payable(getOwnerByIndex(_indexParking)).call{value: getRentPriceByIndex(_indexParking)}('');
    require(sent, 'Transaction failed');

    parkings[_indexParking].renter = msg.sender;
    parkings[_indexParking].rentTime = block.timestamp + (parkings[_indexParking].rentTime * 5); // remove hard coded timestamp
  }

  function unRentParking(uint256 _indexParking) public payable validId(_indexParking) ownerOnly(_indexParking) {
    require(
      getRentTimeByIndex(_indexParking) <= block.timestamp,
      'You cannot ask to unRent yet, wait till the contract finishes'
    );

    //ask permission maybe
    parkings[_indexParking].renter = nullAddress;
    parkings[_indexParking].rentTime = 1 days;
  }

  function buyParking(uint256 _indexParking) public payable validId(_indexParking) {
    require(getOwnerByIndex(_indexParking) != msg.sender, 'You cannot buy your own parking');
    require(msg.value == getRentPriceByIndex(_indexParking), 'You didnt send the good amount to buy the parking');

    (bool sent, ) = payable(getOwnerByIndex(_indexParking)).call{value: getRentPriceByIndex(_indexParking)}('');
    require(sent, 'Transaction failed');

    parkings[_indexParking].owner = msg.sender;
  }

  // true is available, false is unavailable
  function getAvailability(uint256 _indexParking) public view validId(_indexParking) returns (bool) {
    if (parkings[_indexParking].renter != nullAddress) {
      return false;
    }
    return true;
  }

  function getRentPriceByIndex(uint256 _indexParking) public view validId(_indexParking) returns (uint256) {
    return parkings[_indexParking].rentPrice;
  }

  function getOwnerByIndex(uint256 _indexParking) public view validId(_indexParking) returns (address) {
    return parkings[_indexParking].owner;
  }

  function getRenterByIndex(uint256 _indexParking) public view validId(_indexParking) returns (address) {
    return parkings[_indexParking].renter;
  }

  function getParkingPriceByIndex(uint256 _indexParking) public view validId(_indexParking) returns (uint256) {
    return parkings[_indexParking].parkingPrice;
  }

  function getRentTimeByIndex(uint256 _indexParking) public view validId(_indexParking) returns (uint256) {
    return parkings[_indexParking].rentTime;
  }
}
