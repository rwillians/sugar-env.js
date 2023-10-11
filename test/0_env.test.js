'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.current: string', () => {
    it('returns the current environment\'s name (from NODE_ENV)', () => {
      // no way to control `env.current`
      // although we are clearly in test env, NODE_ENV isn't set therefore
      // `current` is taking the fallback value "development"
      expect(env.current).to.be.equal('development')
    })

    it('returns "development" when `NODE_ENV` isn\'t set', () => {
      expect(env.current).to.be.equal('development')
    })
  })

  describe('env.DEVELOPMENT: string', () => {
    it('returns development\'s environment name: "development"', () => {
      expect(env.DEVELOPMENT).to.be.equals('development')
    })
  })

  describe('env.TEST: string', () => {
    it('returns test\'s environment name: "test"', () => {
      expect(env.TEST).to.be.equals('test')
    })
  })

  describe('env.STAGING: string', () => {
    it('returns staging\'s environment name: "staging"', () => {
      expect(env.STAGING).to.be.equals('staging')
    })
  })

  describe('env.REVIEW: string', () => {
    it('returns review\'s environment name: "review"', () => {
      expect(env.REVIEW).to.be.equals('review')
    })
  })

  describe('env.PRODUCTION: string', () => {
    it('returns production\'s environment name: "production"', () => {
      expect(env.PRODUCTION).to.be.equals('production')
    })
  })
})
