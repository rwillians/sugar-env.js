'use strict'

global.expect = require('chai').expect

process.on('unhandledRejection', (reason, promise) => {
  console.log({ event: 'UnhandledPromiseRejection', promise, reason })
  process.exit(1)
})
