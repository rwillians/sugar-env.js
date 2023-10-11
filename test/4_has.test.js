'use strict'

const { describe, it } = require('mocha')
const env = require('../dist/index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env.has(envVarName: string): boolean', () => {
    process.env.FOO_HAS = '1'

    it('returns `true` when the given environment variable exists', () => {
      expect(env.has('FOO_HAS')).to.be.equals(true)
    })

    it('returns `false` when the given environment variable doesn\'t exist', () => {
      expect(env.has('FOOOOOO_DOESNT_EXIST')).to.be.equals(false)
    })
  })
})
