const WebSocket = require('ws')
const p = require('@edorsey/pipeline')
const COINBASE_WS_URL = 'wss://ws-feed.pro.coinbase.com'

let ws
let opened = false

let priceCache = {}

function connect(cb) {
  console.log('connect coinbase')
  ws = new WebSocket(COINBASE_WS_URL)

  ws.on('open', function open() {
    opened = true

    if (!ws) return

    const SUBSCRIPTION_MESSAGE = {
      type: 'subscribe',
      product_ids: ['ETH-USD', 'ETH-BTC'],
      channels: ['ticker']
    }

    p(SUBSCRIPTION_MESSAGE).flow([JSON.stringify, ws.send.bind(ws)])
    cb()
  })

  ws.on('message', function incoming(message) {
    let data = JSON.parse(message)

    if (data.type === 'ticker') return onData(data)
  })

  ws.on('error', function wsError(err) {
    console.log('WEBSOCKET ERROR', err)
    opened = false
    ws = null
  })

  ws.on('close', function wsClose() {
    console.log('WEBSOCKET CLOSED')
    opened = false
    ws = null
    onClose()
  })
}

function onData(data) {
  priceCache[data.product_id] = data.price
}

function close() {
  opened = false
  if (!ws) return
  ws.terminate()
  ws = null
}

function getPrice(fromAsset = 'ETH', toAsset = 'USD') {
  fromAsset = fromAsset.toUpperCase()
  toAsset = toAsset.toUpperCase()
  return priceCache[`${fromAsset}-${toAsset}`] || ''
}

module.exports = {
  connect,
  close,
  getPrice
}
