'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

process.env.EMPTY = ''

describe('const env = require(\'sugar-env\')', () => {
  describe('env.get.boolean(envVarName: string): boolean', () => {
    process.env.NUMBER_ONE_AS_STRING = '1'
    process.env.TRUE_AS_LOWERCASE_STRING = 'true'
    process.env.TRUE_AS_UPPERCASE_STRING = 'TRUE'
    process.env.NUMBER_ZERO_AS_STRING = '0'
    process.env.FALSE_AS_LOWERCASE_STRING = 'false'
    process.env.FALSE_AS_UPPERCASE_STRING = 'FALSE'
    process.env.ANYTHIGN_STRING = 'asdfasdfasdf'

    it('returns `true` when the given environment variable\'s value is "1"', () => {
      expect(env.get.boolean('NUMBER_ONE_AS_STRING', null)).to.be.equals(true)
    })

    it('returns `true` when the given environment variable\'s value is "true" (case insensitve)', () => {
      expect(env.get.boolean('TRUE_AS_LOWERCASE_STRING', null)).to.be.equals(true)
      expect(env.get.boolean('TRUE_AS_UPPERCASE_STRING', null)).to.be.equals(true)
    })

    it('returns `false` for anything else', () => {
      expect(env.get.boolean('NUMBER_ZERO_AS_STRING', null)).to.be.equals(false)
      expect(env.get.boolean('FALSE_AS_LOWERCASE_STRING', null)).to.be.equals(false)
      expect(env.get.boolean('FALSE_AS_UPPERCASE_STRING', null)).to.be.equals(false)
      expect(env.get.boolean('ANYTHIGN_STRING', null)).to.be.equals(false)
    })
  })

  describe('env.get.int(envVarName: string): number', () => {
    process.env.STRING_NUMBER = '45'
    process.env.NAN = 'false'
    process.env.NOT_AN_INTEGER = 'false'

    it('returns `null` when the given environment variable is missing', () => {
      expect(env.get.int('FOOOOOOOBARRRR')).to.be.equals(null)
    })

    it('returns `null` when the given environment variable\'s value is empty', () => {
      expect(env.get.int('EMPTY')).to.be.equals(null)
    })

    it('returns `NaN` when the given environment variable\'s value isn\'t an integer', () => {
      expect(isNaN(env.get.int('NAN'))).to.be.equals(true)
      expect(isNaN(env.get.int('NOT_AN_INTEGER'))).to.be.equals(true)
    })

    it('return a `number` when the given environment variable\'s value is an integer', () => {
      expect(typeof env.get.int('STRING_NUMBER')).to.be.equals('number')
    })
  })

  describe('env.get.float(envVarName: string): number', () => {
    process.env.STRING_NUMBER1 = '45.4'
    process.env.STRING_NUMBER2 = '45'
    process.env.NAN = 'false'

    it('returns `null` when the given environment variable is missing', () => {
      expect(env.get.int('FOOOOOOOBARRRR')).to.be.equals(null)
    })

    it('returns `null` when the given environment variable\'s value is empty', () => {
      expect(env.get.int('EMPTY')).to.be.equals(null)
    })

    it('returns `NaN` when the given environment variable\'s value isn\'t numeric', () => {
      expect(isNaN(env.get.float('NAN', null))).to.be.equals(true)
    })

    it('returns a `number` when the given environment variable\'s value is numeric', () => {
      expect(typeof env.get.float('STRING_NUMBER1', null)).to.be.equals('number')
      expect(typeof env.get.float('STRING_NUMBER2', null)).to.be.equals('number')
    })
  })

  describe('[ DEPRECATED ] env.get.url(envVarName: string): string', () => {
    process.env.EMPTY = ''
    process.env.STRING_URL = 'http://foo.bar'
    process.env.STRING_URL_SLASH = 'http://foo.bar/'

    it('returns `null` when the environment variable\'s value is missing', () => {
      expect(env.get.url('FOOOOOO_MISSING_YEA_BLA')).to.be.equals(null)
    })

    it('returns `null` when the environment variable\'s value is empty', () => {
      expect(env.get.url('EMPTY')).to.be.equals(null)
    })

    it('returns the environment variable\'s exact value when there is already a trailing slash', () => {
      expect(env.get.url('STRING_URL_SLASH', null)).to.be.equals('http://foo.bar/')
    })

    it('returns the environment variable\'s value with a trailing slash', () => {
      expect(env.get.url('STRING_URL', null)).to.be.equals('http://foo.bar/')
    })
  })

  describe('env.get.base64(envVarName: string): string', () => {
    process.env.EMPTY = ''
    process.env.STRING_BASE64 = 'dGVzdHN0cmluZw=='

    it('returns `null` when the environment variable doesn\'t exist', () => {
      expect(env.get.base64('FOOO_BAR_BAZ_DOESNT_EXIST')).to.be.equals(null)
    })

    it('returns `null` when the environment variable\'s value is empty', () => {
      expect(env.get.base64('EMPTY')).to.be.equals(null)
    })

    it('returns the environment variable\'s value after decoding it from base64', () => {
      expect(env.get.base64('STRING_BASE64', null)).to.be.equals('teststring')
    })
  })
})
