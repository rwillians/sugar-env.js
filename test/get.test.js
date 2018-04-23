'use strict'

const env = require('../index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.get(names: Array[String]|String, fallback: String): String', () => {
    process.env['MONGO_URL'] = 'mongo://foo.bar:27018/baz'

    it('returns the environment value when the variable exists', () => {
      expect(env.get('MONGO_URL')).to.be.equals('mongo://foo.bar:27018/baz')
    })

    it('returns `null` by default when the given environment variable(s) doesn\'t exists', () => {
      expect(env.get('FOO_BAR')).to.be.equals(null)
    })

    it('fallback value can be changed by setting the second argument', () => {
      expect(env.get('FOO_BAR', 'baz')).to.be.equals('baz')
    })

    it('returns the first found environment variable\'s value when an array of names is given', () => {
      expect(env.get(['FOO_BAR', 'MONGO_URL'])).to.be.equals('mongo://foo.bar:27018/baz')
    })

    it('returns the fallback value when none of the given environment variable names were found', () => {
      expect(env.get(['FOO_BAR', 'BAR_BAZ'])).to.be.equals(null)
    })
  })
})
