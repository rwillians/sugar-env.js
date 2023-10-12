const { describe, it } = require('mocha')
const { expect } = require('chai')
const { env } = require('../dist/index.js')

describe("import { env } from 'sugar-env'", () => {
  describe("env[string]: Environment", () => {
    describe("e.g.: `env.DEV`", () => {
      it("returns `\"dev\", which is the normalized development environment's name", () => {
        expect(env.DEV).to.be.equal('dev')
      })
    })

    describe("e.g.: `env.TEST`", () => {
      it("returns `\"test\"`, which is the normalized name of the test environment", () => {
        expect(env.TEST).to.be.equal('test')
      })
    })

    describe("e.g.: `env.STAGING`", () => {
      it("returns `\"staging\"`, which is the normalized name of the staging environment", () => {
        expect(env.STAGING).to.be.equal('staging')
      })
    })

    describe("e.g.: `env.REVIEW`", () => {
      it("returns `\"review\"`, which is the normalized name of the review environment", () => {
        expect(env.REVIEW).to.be.equal('review')
      })
    })

    describe("e.g.: `env.PROD`", () => {
      it("returns `\"prod\"`, which is the normalized name of the production environment", () => {
        expect(env.PROD).to.be.equal('prod')
      })
    })
  })

  describe("env.current(): Environment", () => {
    describe("e.g.: `env.current()`", () => {
      it("returns `\"dev\"` when `process.env.NODE_ENV` isn't set", () => {
        delete process.env.NODE_ENV;
        expect(env.current()).to.be.equal(env.DEV)
      })

      it("returns `\"dev\"` when `process.env.NODE_ENV` is empty", () => {
        process.env.NODE_ENV = ''
        expect(env.current()).to.be.equal(env.DEV)
      })

      it("returns `\"dev\"` when `process.env.NODE_ENV` isn't one of: `\"dev\"`, `\"test\"`, `\"ci\"`, `\"staging\"`, `\"review\"` or `\"prod\"`", () => {
        process.env.NODE_ENV = 'foobar'
        expect(env.current()).to.be.equal(env.DEV)
      })

      it("returns the value of `process.env.NODE_ENV` otherwise", () => {
        process.env.NODE_ENV = 'dev'
        expect(env.current()).to.be.equal(env.DEV)
        process.env.NODE_ENV = 'Dev'
        expect(env.current()).to.be.equal(env.DEV)

        process.env.NODE_ENV = 'test'
        expect(env.current()).to.be.equal(env.TEST)
        process.env.NODE_ENV = 'TeSt'
        expect(env.current()).to.be.equal(env.TEST)

        process.env.NODE_ENV = 'ci'
        expect(env.current()).to.be.equal(env.CI)
        process.env.NODE_ENV = 'cI'
        expect(env.current()).to.be.equal(env.CI)

        process.env.NODE_ENV = 'staging'
        expect(env.current()).to.be.equal(env.STAGING)
        process.env.NODE_ENV = 'staGing'
        expect(env.current()).to.be.equal(env.STAGING)

        process.env.NODE_ENV = 'prod'
        expect(env.current()).to.be.equal(env.PROD)
        process.env.NODE_ENV = 'PrOd'
        expect(env.current()).to.be.equal(env.PROD)
      })
    })
  })
})
