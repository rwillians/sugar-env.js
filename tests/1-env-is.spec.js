const { describe, it } = require('mocha')
const { expect } = require('chai')

describe("import { env } from 'sugar-env'", () => {
  describe("env.is(assertionEnvironmentName: string): boolean", () => {
    describe("e.g.: `env.is(env.PROD)`", () => {
      it("returns `true` when current environment's name is equal `assertionEnvironmentName`")
      it("returns `false` otherwise")
    })
  })
})
