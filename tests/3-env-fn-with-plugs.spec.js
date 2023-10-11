const { describe, it,  } = require('mocha')
const { expect } = require('chai')

describe("import { env, is } from 'sugar-env'", () => {
  describe("env<T>(environmentName: string | string[], plugs: T & ChainablePlugs<string | null, T>): PipelinedReturnType<string | null, typeof plugs>", () => {

    /**
     *    SINGLE PLUG
     */
    describe("using built-in plugs:", () => {
      /**
         *    `is.required()`
         */
      describe("`is.required()`", () => {
        describe("e.g.: `env('API_SECRET_KEY', [ is.required() ])`", () => {
          it("throws `MissingRequiredError` when environment variable is missing")
          it("throws `MissingRequiredError` when environment variable's value is empty (after trimming its whitespaces)")
          it("returns string otherwise")
        })
      })

      /**
       *    `is.required()`
       */
      describe("`is.defaultTo(defaultValue: string)`", () => {
        describe("e.g.: `env('PORT', [ is.defaultTo('3000') ])`", () => {
          it("returns the given default value when environment variable is missing")
          it("returns the given default value when environment variable's value is empty (after trimming its whitespaces)")
          it("returns a string otherwise")
        })
      })

      /**
       *    `is.boolean()`
       */
      describe("`is.boolean()`", () => {
        describe("e.g.: `env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])`", () => {
          it("returns `true` when environment variable's value is `\"1\"`")
          it("returns `true` when environment variable's value is `\"true\"` (case insensitive)")
          it("returns `false` otherwise")
        })
      })

      /**
       *    `is.integer()`
       */
      describe("`in.integer()`", () => {
        describe("e.g.: `env('PORT', [ is.integer() ])`", () => {
          it("returns `null` when the environment variable is missing")
          it("returns `null` when environment variable's value is empty (after trimming its whitespaces)")
          it("throws `ExpectedNumericStringError` if the environment variable's value isn't an integer string")
          it("returns a number (integer) otherwise")
        })
      })

      /**
       *    `is.float()`
       */
      describe("`is.float()`", () => {
        describe("e.g.: `env('SAMPLING_SIZE', [ is.float() ])`", () => {
          it("returns `null` when the environment variable is missing")
          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)")
          it("throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string")
          it("returns a number (float) otherwise")
        })
      })

      /**
       *    `is.url()`
       */
      describe("`is.url()`", () => {
        describe("e.g.: `env('API_BASE_URL, [ is.url() ])`", () => {
          it("returns `null` when the environment variable is missing")
          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)")
          it("throws `ExpectedValidUrlError` when the environment variable's value isn't a valid URL string")
          it("returns a string otherwise")
        })
      })

      /**
       *    `is.base64()`
       */
      describe("`is.base64()`", () => {
        describe("e.g.: `env('COOKIE_SECRET, [ is.base64() ])`", () => {
          it("returns `null` when the environment variable is missing")
          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)")
          it("returns the decoded base64 string otherwise")
        })
      })
    })

    /**
     *    COMBINING PLUGS
     */
    describe("plugs can be combined:", () => {
      describe("e.g.: `env('PORT', [ is.defaultTo('3000'), is.integer() ])`", () => {
        it("throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string")
        it("throws `ExpectedNumericStringError` if the default value isn't a numeric string")
        it("returns the given default value as a number (integer) when environment variable is missing")
        it("returns the given default value as a number (integer) when environment variable's value is empty (after trimming its whitespaces)")
        it("returns a number (integer) otherwise")
      })

      describe("e.g.: `env('API_BASE_URL', [ is.required(), is.url() ])`", () => {
        it("throws `MissingRequiredError` if the environment variable is missing")
        it("throws `MissingRequiredError` if the environment variable's value is empty (after trimming its whitespaces)")
        it("throws `ExpectedValidUrlError` if the environment variable's value isn't a valid URL string")
        it("returns a string otherwise")
      })
    })

    /**
     *    CUSTOM PLUG
     */
    describe("can use a custom plug:", () => {
      describe(`
        \`\`\`
        import type { Context } from 'sugar-env'

        const myPlug = (ctx: Context) => {
          return ctx.value === null
            ? { ...ctx, value: 'foo' }
            : ctx
        }
        \`\`\``, () => {
        describe("e.g.: env('FOO', [ myPlug ])", () => {
          it("returns `\"foo\"` when environment variable is missing")
          it("returns `\"foo\"` when environment variable is empty (after trimming its whitespaces)")
          it("returns environment variable's value (string) otherwise")
        })
      })
    })

  })
})
