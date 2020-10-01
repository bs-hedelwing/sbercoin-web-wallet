import axios from 'axios'
import config from 'libs/config'
import webWallet from 'libs/web-wallet'

// todo change apis to sbercoin.info

let domain = ''
let insightDomain = ''
let expDomain = ''
switch (config.getNetwork()) {
  case 'testnet':
    domain = 'https://testnet.qtum.info'
    insightDomain = 'https://testnet.qtum.org'
    break
    case 'mainnet':
      domain = 'https://explorer.sbercoin.com'
      insightDomain = 'https://explorer.sbercoin.com/api/'
      expDomain = 'https://explorer.sbercoin.com'
      break
}
const apiPrefix = domain + '/api'

const _get = async url => {
  return (await axios.get(apiPrefix + url)).data
}

const _post = async (url, data) => {
  return (await axios.post(apiPrefix + url, data)).data
}

export default {
  async getInfo(address) {
    return await _get(`/address/${address}`)
  },

  async getTokenInfo(contractAddress) {
    return await _get(`/contract/${contractAddress}`)
  },

  async getTxList(address, size = 10) {
    const res = await _get(`/address/${address}/txs?page=0&pageSize=${size}`)
    return Promise.all(res.transactions.map(tx => _get(`/tx/${tx}`)))
  },

  async getUtxoList(address) {
    return (await _get(`/address/${address}/utxo`)).map(item => {
      return {
        address: item.address,
        txid: item.transactionId,
        confirmations: item.confirmations,
        isStake: item.isStake,
        amount: item.value,
        value: item.value,
        hash: item.transactionId,
        pos: item.outputIndex,
      }
    })
  },

  async sendRawTx(rawTx) {
    const res = (await (_post('/tx/send', `rawtx=${rawTx}`)))
    return {
      txId: res.txid,
      message: res.message
    }
  },

  async fetchRawTx(txid) {
    return (await _get(`/raw-tx/${txid}`))
  },

  getTxExplorerUrl(tx) {
    return `${expDomain}/tx/${tx}`
  },

  getAddrExplorerUrl(addr) {
    return `${expDomain}/address/${addr}`
  },

  async callContract(address, encodedData) {
    let sender = await webWallet.getWallet().getAddress();
    return (await _get(`/contract/${address}/call/?data=${encodedData}&sender=${sender}`)).executionResult.output
  },

  async getSbercoinInfo() {
    return await _get(`/info`)
  }
}
