const WebSocket = require('ws')
const _ = require('lodash')
const { inspect } = require('util')

let wss

let broadcastCache = {}

function setupSockets(server) {
  wss = new WebSocket.Server({
    server
  })

  wss.on('connection', function connection(ws) {
    console.log('on connection')
    _.each(broadcastCache, (data, type) => {
      console.log('send', data)
      send(ws, createMessage(type, data))
    })
  })
}

function broadcast(type, data) {
  broadcastCache[type] = data
  console.log('bcache', inspect(broadcastCache, { depth: 1 }))
  wss.clients.forEach(function each(client) {
    send(client, createMessage(type, data))
  })
}

function send(client, message) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(message)
  }
}

function createMessage(type, data) {
  console.log('create message', type)
  return JSON.stringify({
    type,
    data
  })
}

module.exports = { broadcast, setupSockets }
