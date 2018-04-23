'use strict'

const env = require('../index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.has(name: String): Boolean', () => {
    process.env['FOO_HAS'] = '1'

    it('returns `true` if exists an environment variable with the given name', () => {
      expect(env.has('FOO_HAS')).to.be.equals(true)
    })

    it('returns `false` when there\'s no environment variable with the given name', () => {
      expect(env.has('FOO_HASNT')).to.be.equals(false)
    })
  })
})
