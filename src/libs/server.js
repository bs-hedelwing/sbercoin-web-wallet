import insight from 'libs/nodes/insight'
import sbercoinInfo from 'libs/nodes/sbercoinInfo'

let nodeConfigs = {
  insight,
  sbercoinInfo
}

const defaultNodeId = 'sbercoinInfo'
let currentNodeId = defaultNodeId

export default {
  currentNode() {
    return nodeConfigs[currentNodeId]
  },

  setNodeId(nodeId) {
    if (nodeConfigs[nodeId]) {
      currentNodeId = nodeId
    }
  }
}
