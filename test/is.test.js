'use strict'

const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('(envA: String).is(envB: String): Boolean', () => {
    it('returns `true` if both given environments are equals', () => {
      expect(env('development').is('development')).to.be.equals(true)
    })
    it('returns `faLse` if they are different', () => {
      expect(env(env.DEVELOPMENT).is(env.TEST)).to.be.equals(false)
    })
  })

  describe('env.is(environment: String): Boolean', () => {
    process.env['NODE_ENV'] = 'development'

    it('returns `true` if the given environment name is the current environment', () => {
      expect(env.is('development')).to.be.equals(true)
    })

    it('returns `false` when the given environment name doesn\'t match the current environment', () => {
      expect(env.is('production')).to.be.equals(false)
    })
  })
})
