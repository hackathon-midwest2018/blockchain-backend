const _ = require('lodash')
const WebSocket = require('ws')
const { broadcast } = require('../socket')
const { getPrice } = require('../coinbase-price')

const headers = {
  Authorization: 'Basic ' + Buffer.from('eric@ericdorsey.com:Oz9lE^8GN*Lp').toString('base64')
}

const NODE_URL = 'wss://terribly-cuddly-starfish.quiknode.io/'

let toEth = (hex) => {
  if (!hex) return
  return parseInt(hex, 16) / 1000000000000000000
}

let toGwei = (hex) => {
  if (!hex) return
  return parseInt(hex, 16) / 1000000000
}

let ws

function connect(cb) {
  console.log('connect')
  ws = new WebSocket(NODE_URL, [], { headers })

  ws.on('open', () => {
    let subscribeCommand = {
      method: 'eth_subscribe',
      params: ['newHeads'],
      id: 1,
      jsonrpc: '2.0'
    }
    ws.send(JSON.stringify(subscribeCommand))
    cb()
  })

  ws.on('message', onMessage)

  ws.on('error', (err) => {
    console.log('WS ERR', err)
  })
}

function onMessage(data) {
  data = JSON.parse(data)
  let newBlockHash = _.get(data, 'params.result.hash', false)
  let newTransactions = _.get(data, 'result.transactions', false)

  let pendingTrans = {
    method: 'parity_pendingTransactions',
    params:[],
    id :1,
    jsonrpc: "2.0"
  }
  ws.send(JSON.stringify(pendingTrans))

  if (newBlockHash) {
    broadcast('block', data.params.result)
    let newBlock = {
      method: 'eth_getBlockByHash',
      params: [newBlockHash, true],
      id: 1,
      jsonrpc: '2.0'
    }
    ws.send(JSON.stringify(newBlock))
  }
  if (newTransactions) {
    let mappedTransactions = _.map(newTransactions, (transaction) => {
      let { from, gas, gasPrice, hash, publicKey, to, transactionIndex, creates, input, value } = transaction
      gas = toGwei(gas)
      gasPrice = toGwei(gasPrice)
      value = toEth(value)
      let ethPrice = getPrice()
      return { from, gas, gasPrice, hash, publicKey, to, transactionIndex, creates, input, value, ethPrice }
    })

    broadcast('blockTransactions', mappedTransactions)
  }
}

module.exports = {
  connect
}
