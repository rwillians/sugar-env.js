'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.get(envVarName: string): string', () => {
    process.env.EMPTY = ''
    process.env.MONGO_URL = 'mongo://foo.bar:27018/baz'

    it('returns `null` when the environment variable doesn\'t exist', () => {
      expect(env.get('FOO_BAR')).to.be.equals(null)
    })

    it('returns `null` when the environment variable\'s value is empty', () => {
      expect(env.get('EMPTY')).to.be.equals(null)
    })

    it('returns the environment variable\'s value when it exists and it isn\'t empty', () => {
      expect(env.get('MONGO_URL')).to.be.equals('mongo://foo.bar:27018/baz')
    })
  })

  describe('env.get(envVarNames: string[]): string', () => {
    process.env.MONGO_URL = 'mongo://foo.bar:27018/baz'

    it('returns the value of the first environment variable which contains a non-empty value', () => {
      expect(env.get(['FOO_BAR', 'MONGO_URL'])).to.be.equals('mongo://foo.bar:27018/baz')
    })
  })

  describe('env.get(envVarName: string | string[], defaultValue: string): string', () => {
    process.env.EMPTY1 = ''
    process.env.EMPTY2 = ''

    it('returns `defaultValue` when the given environment variable doesn\'t exist', () => {
      expect(env.get('FOOOO_BAAAR_DOESNT_EXIST', 'baz')).to.be.equals('baz')
      expect(env.get(['FOOOO_BAAAR_DOESNT_EXIST1', 'FOOOO_BAAAR_DOESNT_EXIST2'], 'baz')).to.be.equals('baz')
    })

    it('returns `defaultValue` when the given environment variable\'s value is empty', () => {
      expect(env.get('EMPTY1', 'baz')).to.be.equals('baz')
      expect(env.get(['EMPTY1', 'EMPTY2'], 'baz')).to.be.equals('baz')
    })
  })
})
