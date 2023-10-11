'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.is(environment: string): boolean', () => {
    process.env.NODE_ENV = 'development'

    it('returns `true` when the current environment name is the one specified', () => {
      expect(env.is('development')).to.be.equals(true)
    })

    it('returns `false` when the current environment name is different than the one specified', () => {
      expect(env.is('production')).to.be.equals(false)
    })
  })

  describe('[ DEPRECATED ] env(a: String).is(b: String): boolean', () => {
    it('returns `true` when "a" is equals "b"', () => {
      expect(env('development').is('development')).to.be.equals(true)
    })

    it('returns `false` when "a" is different than "b"', () => {
      expect(env('development').is('production')).to.be.equals(false)
    })
  })
})
