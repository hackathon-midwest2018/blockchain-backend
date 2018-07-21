const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

let controllers = require('./controllers')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

controllers(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.statusCode = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  let mesesage = err.message

  let statusCode = err.status || err.statusCode || 500

  let result = {
    statusCode,
    error: mesesage
  }

  if (process.env.NODE_ENV === 'development') result.stack = err.stack

  console.error(err)

  res.status(statusCode)
  res.json(result)
})

module.exports = app
