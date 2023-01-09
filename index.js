// MODULES
import axios from 'axios';

// CONFIG
import config from './lib/config.js';

// SERVICES
import services from './lib/services.js';

// UTILS
import utils from './lib/utils.js';

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
      displayFloat: utils.displayFloat,
      connectWallet: utils.connectWallet,
      addDots: utils.addDots,
    };
  }
}

// Service bindings
Quontral.prototype.getPrice = services.getPrice;
Quontral.prototype.getQuote = services.getQuote;
Quontral.prototype.sign = services.sign;
Quontral.prototype.setAllowance = services.setAllowance;
Quontral.prototype.sendTransaction = services.sendTransaction;

export default Quontral;
