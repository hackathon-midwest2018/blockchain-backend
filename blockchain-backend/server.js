const _ = require("lodash")
const WebSocket = require("ws")
const options = {}

options.headers = {
  Authorization: "Basic " + Buffer.from("eric@ericdorsey.com:Oz9lE^8GN*Lp").toString("base64")
}

let connectUrl = "wss://terribly-cuddly-starfish.quiknode.io/"

options.headers = options.headers
const ws = new WebSocket(connectUrl, [], options)

ws.on("open", () => {
  let subscribeCommand = {
    "method": "eth_subscribe",
    "params": [
      "newHeads"
    ],
    "id": 1,
    "jsonrpc": "2.0"
  }
  ws.send(JSON.stringify(subscribeCommand))
})

let toEth = (hex) => {
  if (!hex) return
  return parseInt(hex, 16)/1000000000000000000
}

let toGwei = (hex) => {
  if (!hex) return
  return parseInt(hex, 16)/1000000000
}

ws.on("message", function incoming(data) {
  data = JSON.parse(data)
  console.log(data)
  let newBlockHash = _.get(data, "params.result.hash", false)
  let newTransactions = _.get(data, "result.transactions", false)
  if (newBlockHash) {
    let newBlock = {
      "method": "eth_getBlockByHash",
      "params": [
        newBlockHash,
        true
      ],
      "id": 1,
      "jsonrpc": "2.0"
    }
    ws.send(JSON.stringify(newBlock))
  }
  if (newTransactions) {
    let mappedTransactions = _.map(newTransactions, (transaction) => {
      let {from, gas, gasPrice, hash, publicKey, to, transactionIndex, creates, input, value} = transaction
      gas = toGwei(gas)
      gasPrice = toGwei(gasPrice)
      value = toEth(value)
      return {from, gas, gasPrice, hash, publicKey, to, transactionIndex, creates, input, value}
    })

    console.log("mappedTransactions", mappedTransactions)
  }
})
