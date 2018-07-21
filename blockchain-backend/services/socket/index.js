const WebSocket = require('ws')

let wss

function setupSockets(server) {
  wss = new WebSocket.Server({
    server
  })
}

function broadcast(type, data) {
  console.log('broadcast', type, data[0])
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type,
          data
        })
      )
    }
  })
}

module.exports = { broadcast, setupSockets }
