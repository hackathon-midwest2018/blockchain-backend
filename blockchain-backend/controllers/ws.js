const express = require('express')
const { URL } = require('url')

let router = express.Router()

router.get('/', function(req, res, next) {
  res.json('Hello')
})

function mount(app) {
  app.use('/ws', router)
}

module.exports = mount
