'use strict'

const env = require('../index')
const { expect } = require('chai')

describe('const env = require(\'sugar-env\')', () => {
  describe('env(current).is(environment: String): Boolean', () => {
    it('returns `true` if the given environment name is the current environment', () => {
      expect(env('development').is('development')).to.be.equals(true)
    })

    it('returns `false` when the given environment name doesn\'t match the current environment', () => {
      expect(env('development').is('production')).to.be.equals(false)
    })
  })
})
