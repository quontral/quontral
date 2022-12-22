// MODULES
import Web3 from 'web3';
import axios from 'axios';

// CONFIG
import config from './lib/config.js';

// SERVICES
import { getPrice, getQuote, setAllowance, sendTransaction } from './lib/services.js';

// UTILS
import { displayFloat, connectWallet } from './lib/utils.js';

class Quontral {
  constructor({ apiKey, chainId = 56 }) {
    if (!apiKey) {
      throw new Error('Api key is not provided in init');
    }

    if (typeof apiKey !== 'string') {
      throw new Error('Api key is not provided in init');
    }

    axios.get('https://api.quontral.com/v1/core/check-apikey/' + apiKey);

    this.config = {
      ERC20_ABI: config.ERC20_ABI,
      apiKey: apiKey,
      chainId: chainId,
    };

    this.utils = {
      displayFloat,
      connectWallet,
    };
  }
}

// API Endpoint services
Quontral.prototype.getPrice = getPrice;
Quontral.prototype.getQuote = getQuote;

// Wallet services

// Create a allowance pool on current provider wallet
Quontral.prototype.setAllowance = setAllowance;
Quontral.prototype.sendTransaction = sendTransaction;

export default Quontral;
