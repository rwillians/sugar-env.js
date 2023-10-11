const { describe, it } = require('mocha')
const { expect } = require('chai')

describe("import { env } from 'sugar-env'", () => {
  describe("env(envVarName: string | string[]): string | null", () => {
    describe("e.g.: `env('S3_KEY_SECRET')`", () => {
      it("returns `null` when environment variable is missing")
      it("returns `null` when environment variable is empty (after trimming its whitespaces)")
      it("returns the environment variable's value otherwise")
    })

    describe("e.g.: `env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])`", () => {
      it("returns `null` when all environment variables are missing")
      it("returns `null` when the only environment variable present is empty (after trimming its whitespaces)")
      it("returns the value of the first found non-empty environment variable")
    })
  })
})
