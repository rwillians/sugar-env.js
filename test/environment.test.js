'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.ENVIRONMENT: String', () => {
    it('Should return the test environment string', () => {
      expect(env.TEST).to.be.equals('test')
    })
    it('Should return the development environment string', () => {
      expect(env.DEVELOPMENT).to.be.equals('development')
    })
    it('Should return the staging environment string', () => {
      expect(env.STAGING).to.be.equals('staging')
    })
    it('Should return the production environment string', () => {
      expect(env.PRODUCTION).to.be.equals('production')
    })
    it('Should return the review environment string', () => {
      expect(env.REVIEW).to.be.equals('review')
    })
  })
})
