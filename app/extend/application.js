const path = require('path')

const CHAIN = Symbol('sbercoin.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.sbercoininfo.lib.Chain.get(this.config.sbercoin.chain)
    return this[CHAIN]
  },
  get sbercoininfo() {
    return {
      lib: require(path.resolve(this.config.sbercoininfo.path, 'lib')),
      rpc: require(path.resolve(this.config.sbercoininfo.path, 'rpc'))
    }
  }
}
