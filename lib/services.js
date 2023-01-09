'use strict';

// MODULES
import Web3 from 'web3';
import axios from 'axios';

//  CONFIG
import config from './config.js';

// Endpoint services

export async function getPrice({ chain = 'bsc', buyTokenAddress, sellTokenAddress, sellTokenAmount, buyTokenAmount, buyTokenFee, ownerAddress, feeOwner, slippage, gasPrice }) {
  let url = `https://api.quontral.com/v1/swap/${chain.toLowerCase()}/price?buyTokenAddress=${buyTokenAddress}&sellTokenAddress=${sellTokenAddress}&apiKey=${this.config.apiKey}`;

  if (buyTokenAmount) {
    url += `&buyTokenAmount=${buyTokenAmount}`;
  } else {
    url += `&sellTokenAmount=${sellTokenAmount}`;
  }

  if (buyTokenFee) {
    url += `&buyTokenPercentageFee=${buyTokenFee}`;
  }

  if (ownerAddress) {
    url += `&takerAddress=${ownerAddress}`;
  }

  if (feeOwner) {
    url += `&feeRecipient=${feeOwner}`;
  }

  if (slippage) {
    url += `&slippagePercentage=${slippage}`;
  }

  if (gasPrice) {
    url += `&gasPrice=${gasPrice}`;
  }

  const res = await axios.get(url);
  return res;
}

export async function getQuote({ chain = 'bsc', buyTokenAddress, sellTokenAddress, sellTokenAmount, buyTokenAmount, buyTokenFee, ownerAddress, feeOwner, slippage, gasPrice }) {
  let url = `https://api.quontral.com/v1/swap/${chain.toLowerCase()}/quote?buyTokenAddress=${buyTokenAddress}&sellTokenAddress=${sellTokenAddress}&apiKey=${this.config.apiKey}`;

  if (buyTokenAmount) {
    url += `&buyTokenAmount=${buyTokenAmount}`;
  } else {
    url += `&sellTokenAmount=${sellTokenAmount}`;
  }

  if (buyTokenFee) {
    url += `&buyTokenPercentageFee=${buyTokenFee}`;
  }

  if (ownerAddress) {
    url += `&takerAddress=${ownerAddress}`;
  }

  if (feeOwner) {
    url += `&feeRecipient=${feeOwner}`;
  }

  if (slippage) {
    url += `&slippagePercentage=${slippage}`;
  }

  if (gasPrice) {
    url += `&gasPrice=${gasPrice}`;
  }

  const res = await axios.get(url);
  return res;
}

// Wallet functions
export async function setAllowance({ amount = '115792089237316200000000000000000000000000000000000000000000', allowanceAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff', ownerAddress, sellTokenAddress }) {
  const web3 = new Web3(Web3.givenProvider);
  const ERC20TokenContract = new web3.eth.Contract(this.config.ERC20_ABI, sellTokenAddress);

  await ERC20TokenContract.methods.approve(allowanceAddress, amount).send({ from: ownerAddress });
}

// address = current web3 wallet address, domain = example.com, uri = https://example.com
export async function sign({ address = '', chainId = 56, domain, uri }) {
  const web3 = new Web3(Web3.givenProvider);

  try {
    const signres = await axios.post(config.api.domain + '/v1/blockchain/request-message', {
      address: address,
      chainId: chainId,
      domain: domain,
      uri: uri,
    });

    console.log(signres);

    const message = signres.data.message;
    const signature = await web3.eth.personal.sign(message, address);
    const verifyres = await axios.post(config.api.domain + '/v1/blockchain/verify-sign', {
      message,
      signature,
    });

    console.log(verifyres);

    return {
      message,
      signature,
    };
  } catch (err) {}
}

export async function sendTransaction({ chain = 'bsc', ownerAddress, buyTokenAddress, sellTokenAddress, sellTokenAmount, allowanceAddress }) {
  const web3 = new Web3(Web3.givenProvider);
  const ERC20TokenContract = new web3.eth.Contract(this.config.ERC20_ABI, buyTokenAddress);

  let res = null;
  try {
    res = await axios.get(`https://api.quontral.com/v1/swap/${chain.toLowerCase()}/quote?buyTokenAddress=${buyTokenAddress}&sellTokenAddress=${sellTokenAddress}&sellTokenAmount=${sellTokenAmount}&takerAddress=${ownerAddress}`);
  } catch (err) {
    await ERC20TokenContract.methods.approve(allowanceAddress, '115792089237316200000000000000000000000000000000000000000000').send({ from: ownerAddress });

    res = await axios.get(`https://api.quontral.com/v1/swap/${chain.toLowerCase()}/quote?buyTokenAddress=${buyTokenAddress}&sellTokenAddress=${sellTokenAddress}&sellTokenAmount=${sellTokenAmount}&takerAddress=${ownerAddress}`);
  }

  const transactionParameters = {
    gasPrice: web3.utils.toHex(res.data.gasPrice), // customizable by user during MetaMask confirmation.
    gas: web3.utils.toHex(res.data.gas), // customizable by user during MetaMask confirmation.
    to: res.data.to, // Required except during contract publications.
    from: ownerAddress, // must match user's active address.
    value: res.data.value, // Only required to send ether to the recipient from the initiating external account.
    data: res.data.data, // Optional, but used for defining smart contract creation and interaction.
    chainId: web3.utils.toHex(this.chainId), // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  const receipt = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  return receipt;
}

export default {
  getPrice,
  getQuote,
  setAllowance,
  sign,
  sendTransaction,
};
