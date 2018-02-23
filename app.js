const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})

// simple API
app.use('/healthcheck', require('express-healthcheck')())
app.use('/echo', (req, res) => {
  res.send({message: `Hello ${req.query.name}`})
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({error: err.message})
})

module.exports = app
