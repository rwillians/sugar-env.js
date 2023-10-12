const { describe, it } = require('mocha')
const { expect } = require('chai')
const { env } = require('../dist/index.js')

describe("import { env } from 'sugar-env'", () => {
  describe("env(envVarName: string | string[]): string | null", () => {
    describe("e.g.: `env('S3_KEY_SECRET')`", () => {
      it("returns `null` when environment variable is missing", () => {
        delete process.env.S3_KEY_SECRET
        expect(env('S3_KEY_SECRET')).to.be.equal(null)
      })

      it("returns `null` when environment variable is empty (after trimming its whitespaces)", () => {
        process.env.S3_KEY_SECRET = '   '
        expect(env('S3_KEY_SECRET')).to.be.equal(null)
      })

      it("returns the environment variable's value otherwise", () => {
        process.env.S3_KEY_SECRET = 'a1b2c3'
        expect(env('S3_KEY_SECRET')).to.be.equal('a1b2c3')
      })
    })

    describe("e.g.: `env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])`", () => {
      it("returns `null` when all environment variables are missing", () => {
        delete process.env.PROD_S3_KEY_SECRET
        delete process.env.S3_KEY_SECRET
        expect(env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])).to.be.equal(null)
      })

      it("returns `null` when the only environment variable present is empty (after trimming its whitespaces)", () => {
        delete process.env.PROD_S3_KEY_SECRET
        process.env.S3_KEY_SECRET = '   '
        expect(env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])).to.be.equal(null)
      })

      it("returns the value of the first found non-empty environment variable", () => {
        delete process.env.PROD_S3_KEY_SECRET
        process.env.S3_KEY_SECRET = 'a b c'
        expect(env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])).to.be.equal('a b c')
      })
    })
  })
})
