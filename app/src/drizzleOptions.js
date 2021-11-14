import Web3 from 'web3';
import ComplexStorage from './contracts/ComplexStorage.json';
import SimpleStorage from './contracts/SimpleStorage.json';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://localhost:8545',
    },
  },
  contracts: [SimpleStorage, ComplexStorage],
  events: {
    SimpleStorage: ['StorageSet'],
  },
};

export default options;
