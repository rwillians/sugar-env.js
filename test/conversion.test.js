'use strict'

const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.get.int(name: String): Number', () => {
    process.env.STRING_NUMBER = "45"

    it('returns the given env as number', () => {
      expect(typeof env.get.int('STRING_NUMBER', null)).to.be.equals('number')
    })

    it('returns `null` when the parameter is null', () => {
      expect(env.get.int('NULL', null)).to.be.equals(null)
    })
  })

  describe('env.get.float(name: String): Number', () => {
    process.env.STRING_NUMBER = "45.4"

    it('returns the given env as number', () => {
      expect(typeof env.get.float('STRING_NUMBER', null)).to.be.equals('number')
    })

    it('returns `null` when the parameter is null', () => {
      expect(env.get.float('NULL', null)).to.be.equals(null)
    })
  })

  describe('env.get.url(name: String): String', () => {
    process.env.STRING_URL = "http://foo.bar"
    process.env.STRING_URL_SLASH = "http://foo.bar/"

    it('returns the given env with trailing slash', () => {
      expect(typeof env.get.url('STRING_URL', null)).to.be.equals('string')
      expect(env.get.url('STRING_URL', null)).to.be.equals('http://foo.bar/')
    })

    it('returns `null` when the parameter is null', () => {
      expect(env.get.url('NULL', null)).to.be.equals(null)
    })

    it('returns the value when there is already a trailing slash', () => {
      expect(env.get.url('STRING_URL_SLASH', null)).to.be.equals('http://foo.bar/')
    })
  })

  describe('env.get.base64(name: String): String', () => {
    process.env.STRING_BASE64 = "dGVzdHN0cmluZw=="

    it('returns the given env as plain text', () => {
      expect(typeof env.get.base64('STRING_BASE64', null)).to.be.equals('string')
      expect(env.get.base64('STRING_BASE64', null)).to.be.equals('teststring')
    })

    it('returns `null` when the parameter is null', () => {
      expect(env.get.base64('NULL', null)).to.be.equals(null)
    })
  })
})
