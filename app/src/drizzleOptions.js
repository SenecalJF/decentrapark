import Decentrapark from './contracts/Decentrapark.json';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://localhost:8545',
    },
  },
  contracts: [Decentrapark],
  // events: {
  //   Decentrapark: ['LeaseCreated', 'PaidRent'],
  // },
};

export default options;
