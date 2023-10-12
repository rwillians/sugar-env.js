const { describe, it } = require('mocha')
const { expect } = require('chai')
const { env, AssertionError } = require('../dist/index.js')

describe("import { env } from 'sugar-env'", () => {
  describe("env.is(assertionEnvironmentName: string): boolean", () => {
    describe("e.g.: `env.is(env.PROD)`", () => {
      it("returns `true` when current environment's name is equal `assertionEnvironmentName`", () => {
        process.env.NODE_ENV = 'ci'
        expect(env.is(env.CI)).to.be.equal(true)
      })

      it("returns `false` otherwise", () => {
        process.env.NODE_ENV = 'review'
        expect(env.is(env.CI)).to.be.equal(false)
      })
    })
  })

  describe("env.mustBe(assertionEnvironmentName: string): void", () => {
    describe("e.g.: `env.mustBe(env.DEV)`", () => {
      it("throws `EnvironmentAssertionError` when the current environment is different than the one specified", () => {
        process.env.NODE_ENV = 'prod'
        expect(() => env.mustBe(env.REVIEW)).to.throw(AssertionError)
      })

      it("does nothing when the current environment is the same as the one specified", () => {
        process.env.NODE_ENV = 'test'
        expect(env.mustBe(env.TEST)).to.be.equal(undefined)
      })
    })
  })
})
