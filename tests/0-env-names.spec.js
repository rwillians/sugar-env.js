const { describe, it } = require('mocha')
const { expect } = require('chai')

describe("import { env } from 'sugar-env'", () => {
  describe("env[string]: string", () => {
    describe("e.g.: `env.DEV`", () => {
      it("returns `\"dev\", which is the normalized development environment's name")
    })

    describe("e.g.: `env.TEST`", () => {
      it("returns `\"test\"`, which is the normalized name of the test environment")
    })

    describe("e.g.: `env.STAGING`", () => {
      it("returns `\"staging\"`, which is the normalized name of the staging environment")
    })

    describe("e.g.: `env.REVIEW`", () => {
      it("returns `\"review\"`, which is the normalized name of the review environment")
    })

    describe("e.g.: `env.PROD`", () => {
      it("returns `\"prod\"`, which is the normalized name of the production environment")
    })

    describe("e.g.: `env.current`", () => {
      it("returns `\"dev\"` when `process.env.NODE_ENV` is empty")
      it("returns `\"dev\"` when `process.env.NODE_ENV` isn't set")
      it("returns `\"dev\"` when `process.env.NODE_ENV` isn't one of: `\"dev\"`, `\"test\"`, `\"staging\"`, `\"review\"` or `\"prod\"`")
      it("returns the value of `process.env.NODE_ENV` otherwise")
    })
  })
})
