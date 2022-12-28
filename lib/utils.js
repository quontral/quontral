'use strict';

// MODULES
import Web3 from 'web3';

/* Utils */

// Creates a connection to the current web3 wallet with the current confiurations such as different networks.
export async function connectWallet({ chainId = 56 }) {
  if (!window.ethereum) {
    throw new Error('Web3 lib is not imported');
  }

  const chains = {
    // Ethereum Mainnet
    1: {
      chainId: Web3.utils.toHex(1),
      chainName: 'ETHW-mainnet',
      rpcUrls: ['https://mainnet.ethereumpow.org'],
      blockExplorerUrls: ['https://mainnet.ethwscan.com'],
    },
    // Binance Smart Chain Mainnet
    56: {
      chainId: Web3.utils.toHex(56),
      chainName: 'Smart Chain',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  };

  const accounts = await ethereum.request({
    method: 'eth_requestAccounts',
  });

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(chainId) }],
    });
  } catch (err) {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chains[chainId]],
    });
  }

  return accounts;
}

export function displayFloat(num, index = 2) {
  if (typeof num !== 'number') {
    return null;
  }

  let strNum = num.toString();
  let newFloat = '';
  let ctr = 0;
  const strNumParts = strNum.split('.');

  const strNumLeft = strNumParts[0];
  const strNumRight = strNumParts[1];

  if (!strNumLeft || !strNumRight) {
    return num;
  }

  if (strNum.includes('e-')) {
    const numparts = strNum.split('e-');
    const zeroCount = Number(numparts[1]);
    const value = numparts[0].split('.').join('');
    let finalValue = '0.';

    for (let i = 0; i < zeroCount - 1; i++) {
      finalValue = finalValue + '0';
    }

    finalValue = finalValue + value;

    for (let i = 0; i < finalValue.length; i++) {
      if (ctr < index) {
        newFloat = newFloat + finalValue[i];
      }

      if ((finalValue[i] !== '0' && finalValue[i] !== '.') || ctr) {
        ctr++;
      }
    }

    return newFloat;
  } else {
    for (let i = 0; i < strNumRight.length; i++) {
      if (ctr < index) {
        newFloat = newFloat + strNumRight[i];
      }

      if (strNumRight[i] !== '0' || ctr) {
        ctr++;
      }
    }
  }

  return Number(strNumLeft + '.' + newFloat);
}

export function addDots(num) {
  if (!num || typeof num !== 'number') {
    return null;
  }

  num = num.toString();
  let newNum = '';
  let ctr = 0;

  for (let i = num.length - 1; i > -1; i--) {
    if (ctr && ctr % 3 === 0) {
      newNum = num[i] + '.' + newNum;
    } else {
      newNum = num[i] + newNum;
    }

    ctr++;
  }

  return newNum;
}

export default {
  connectWallet,
  addDots,
  displayFloat,
};
