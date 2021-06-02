import tokens from 'libs/token.json'
import config from 'libs/config'
import server from 'libs/server'
import abi from 'ethjs-abi'
import sbercoin from 'sbercoinjs-lib'
import BN from 'bn.js'

function loadTokenList(network) {
  let tokenList = tokens[network].concat(config.get(`tokenList_${network}`, []))
  tokenList.sort((a, b) => {
    return a.symbol > b.symbol ? 1 : -1
  })
  return tokenList
}

export default {
  getTokenList() {
    return loadTokenList(config.getNetwork())
  },

  addCustomToken(address, name, symbol, decimals) {
    const network = config.getNetwork()
    if (tokens[network].find(item => address === item.address)) {
      return true
    }
    const savedTokenList = config.get(`tokenList_${network}`, [])
    const index = savedTokenList.findIndex(item => address === item.address)
    savedTokenList[index === -1 ? savedTokenList.length : index] = {
      name,
      symbol,
      address,
      decimals,
    }
    config.set(`tokenList_${network}`, savedTokenList, 365 * 86400)
  },

  async fetchTokenInfo(contractAddress) {
    try {
      return await server.currentNode().getTokenInfo(contractAddress)
    } catch (e) {
      throw 'this contract is not a qrc20 token'
    }
  },

  checkSymbol(symbol) {
    const tokenList = loadTokenList(config.getNetwork())
    return tokenList.filter((token) => {
      return token.symbol === symbol
    }).length > 0
  },

  getTokenBySymbol(symbol) {
    const tokenList = loadTokenList(config.getNetwork())
    return tokenList.filter((token) => {
      return token.symbol === symbol
    })[0]
  },

  encodeSendData(token, address, amount) {
    let _amount = new BN(amount, 10)
    let _decimals = new BN(token.decimals, 10)
    let ten = new BN(10, 10)
    let multiplicator = ten.pow(_decimals)
    let _res = _amount.mul(multiplicator)
    return 'a9059cbb' + abi.encodeParams(['address', 'uint256'], ['0x' + sbercoin.address.fromBase58Check(address)['hash'].toString('hex'), _res.toString(16)]).substr(2)
  }
}
