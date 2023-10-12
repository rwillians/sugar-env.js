const { describe, it,  } = require('mocha')
const { expect } = require('chai')
const { env, is } = require('../dist/index.js')
const { ExpectedNumericStringError, MissingRequiredError, ExpectedValidUrlError } = require('../dist/index.js')

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
          it("throws `MissingRequiredError` when environment variable is missing", () => {
            delete process.env.API_SECRET_KEY

            const fn = () => env('API_SECRET_KEY', [ is.required() ])

            expect(fn).to.throw(MissingRequiredError)
          })

          it("throws `MissingRequiredError` when environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.API_SECRET_KEY = '    '

            const fn = () => env('API_SECRET_KEY', [ is.required() ])

            expect(fn).to.throw(MissingRequiredError)
          })

          it("returns a `string` otherwise", () => {
            process.env.API_SECRET_KEY = ' a1 b2 c3 '
            expect(env('API_SECRET_KEY', [ is.required() ])).to.be.equal(' a1 b2 c3 ')
          })
        })
      })

      /**
       *    `is.required()`
       */
      describe("`is.defaultTo(defaultValue: string)`", () => {
        describe("e.g.: `env('PORT', [ is.defaultTo('3000') ])`", () => {
          it("returns the given default value when environment variable is missing", () => {
            delete process.env.PORT
            expect(env('PORT', [ is.defaultTo('3000') ])).to.be.equal('3000')
          })

          it("returns the given default value when environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.PORT = '   '
            expect(env('PORT', [ is.defaultTo('3000') ])).to.be.equal('3000')
          })

          it("returns a string otherwise", () => {
            process.env.PORT = '4000'
            expect(env('PORT', [ is.defaultTo('3000') ])).to.be.equal('4000')
          })
        })
      })

      /**
       *    `is.boolean()`
       */
      describe("`is.boolean()`", () => {
        describe("e.g.: `env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])`", () => {
          it("returns `true` when environment variable's value is `\"1\"`", () => {
            process.env.FEATURE_ADMIN_ENABLED = '1'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(true)
          })

          it("returns `true` when environment variable's value is `\"true\"` (case insensitive)", () => {
            process.env.FEATURE_ADMIN_ENABLED = 'true'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(true)

            process.env.FEATURE_ADMIN_ENABLED = 'tRuE'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(true)
          })

          it("returns `false` otherwise", () => {
            process.env.FEATURE_ADMIN_ENABLED = 'false'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(false)

            process.env.FEATURE_ADMIN_ENABLED = 'FalSe'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(false)

            process.env.FEATURE_ADMIN_ENABLED = '0'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(false)

            process.env.FEATURE_ADMIN_ENABLED = 'foobar'
            expect(env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])).to.be.equal(false)
          })
        })
      })

      /**
       *    `is.integer()`
       */
      describe("`in.integer()`", () => {
        describe("e.g.: `env('PORT', [ is.integer() ])`", () => {
          it("returns `null` when the environment variable is missing", () => {
            delete process.env.PORT
            expect(env('PORT', [ is.integer() ])).to.be.equal(null)
          })

          it("returns `null` when environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.PORT = '   '
            expect(env('PORT', [ is.integer() ])).to.be.equal(null)
          })

          it("throws `ExpectedNumericStringError` if the environment variable's value isn't an integer string", () => {
            process.env.PORT = 'xyz'
            expect(() => env('PORT', [ is.integer() ])).to.throw(ExpectedNumericStringError)
          })

          it("returns a number (integer) otherwise", () => {
            process.env.PORT = '5432'
            expect(env('PORT', [ is.integer() ])).to.be.equal(5432)

            process.env.PORT = '123.4'
            expect(env('PORT', [ is.integer() ])).to.be.equal(123)
          })
        })
      })

      /**
       *    `is.float()`
       */
      describe("`is.float()`", () => {
        describe("e.g.: `env('SAMPLING_SIZE', [ is.float() ])`", () => {
          it("returns `null` when the environment variable is missing", () => {
            delete process.env.SAMPLING_SIZE
            expect(env('SAMPLING_SIZE', [ is.float() ])).to.be.equal(null)
          })

          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.SAMPLING_SIZE = '   '
            expect(env('SAMPLING_SIZE', [ is.float() ])).to.be.equal(null)
          })

          it("throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string", () => {
            process.env.SAMPLING_SIZE = 'xyz'
            expect(() => env('SAMPLING_SIZE', [ is.float() ])).to.throw(ExpectedNumericStringError)
          })

          it("returns a number (float) otherwise", () => {
            process.env.SAMPLING_SIZE = '123.4'
            expect(env('SAMPLING_SIZE', [ is.float() ])).to.be.equal(123.4)

            process.env.SAMPLING_SIZE = '123'
            expect(env('SAMPLING_SIZE', [ is.float() ])).to.be.equal(123.0)
          })
        })
      })

      /**
       *    `is.url()`
       */
      describe("`is.url()`", () => {
        describe("e.g.: `env('API_BASE_URL, [ is.url() ])`", () => {
          it("returns `null` when the environment variable is missing", () => {
            delete process.env.API_BASE_URL
            expect(env('API_BASE_URL', [ is.url() ])).to.be.equal(null)
          })

          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.API_BASE_URL = '   '
            expect(env('API_BASE_URL', [ is.url() ])).to.be.equal(null)
          })

          it("throws `ExpectedValidUrlError` when the environment variable's value isn't a valid URL string", () => {
            process.env.API_BASE_URL = ' a b c '
            expect(() => env('API_BASE_URL', [ is.url() ])).to.throw(ExpectedValidUrlError)
          })

          it("returns a string otherwise", () => {
            process.env.API_BASE_URL = 'https://api.foo.bar/v1'
            expect(env('API_BASE_URL', [ is.url() ])).to.be.equal('https://api.foo.bar/v1')
          })
        })
      })

      /**
       *    `is.base64()`
       */
      describe("`is.base64()`", () => {
        describe("e.g.: `env('COOKIE_SECRET, [ is.base64() ])`", () => {
          it("returns `null` when the environment variable is missing", () => {
            delete process.env.COOKIE_SECRET
            expect(env('COOKIE_SECRET', [ is.base64() ])).to.be.equal(null)
          })

          it("returns `null` when the environment variable's value is empty (after trimming its whitespaces)", () => {
            process.env.COOKIE_SECRET = '   '
            expect(env('COOKIE_SECRET', [ is.base64() ])).to.be.equal(null)
          })

          it("returns the decoded base64 string otherwise", () => {
            process.env.COOKIE_SECRET = 'Zm9vIGJhciBiYXo='
            expect(env('COOKIE_SECRET', [ is.base64() ])).to.be.equal('foo bar baz')
          })
        })
      })
    })

    /**
     *    COMBINING PLUGS
     */
    describe("plugs can be combined:", () => {
      describe("e.g.: `env('PORT', [ is.defaultTo('3000'), is.integer() ])`", () => {
        it("throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string", () => {
          process.env.PORT = 'xyz'
          expect(() => env('PORT', [ is.defaultTo('3000'), is.integer() ])).to.throw(ExpectedNumericStringError)
        })

        it("throws `ExpectedNumericStringError` if the default value isn't a numeric string", () => {
          delete process.env.PORT
          expect(() => env('PORT', [ is.defaultTo('xyz'), is.integer() ])).to.throw(ExpectedNumericStringError)
        })

        it("returns the given default value as a number (integer) when environment variable is missing", () => {
          delete process.env.PORT
          expect(env('PORT', [ is.defaultTo('3000'), is.integer() ])).to.be.equal(3000)
        })

        it("returns the given default value as a number (integer) when environment variable's value is empty (after trimming its whitespaces)", () => {
          process.env.PORT = '   '
          expect(env('PORT', [ is.defaultTo('3000'), is.integer() ])).to.be.equal(3000)
        })

        it("returns a number (integer) otherwise", () => {
          process.env.PORT = '2345'
          expect(env('PORT', [ is.defaultTo('3000'), is.integer() ])).to.be.equal(2345)
        })
      })

      describe("e.g.: `env('API_BASE_URL', [ is.required(), is.url() ])`", () => {
        it("throws `MissingRequiredError` if the environment variable is missing", () => {
          delete process.env.API_BASE_URL

          const fn = () => env('API_BASE_URL', [ is.required(), is.url() ])

          expect(fn).to.throw(MissingRequiredError)
        })

        it("throws `MissingRequiredError` if the environment variable's value is empty (after trimming its whitespaces)", () => {
          process.env.API_BASE_URL = '   '

          const fn = () => env('API_BASE_URL', [ is.required(), is.url() ])

          expect(fn).to.throw(MissingRequiredError)
        })

        it("throws `ExpectedValidUrlError` if the environment variable's value isn't a valid URL string", () => {
          process.env.API_BASE_URL = ' a b c'

          const fn = () => env('API_BASE_URL', [ is.required(), is.url() ])

          expect(fn).to.throw(ExpectedValidUrlError)
        })

        it("returns a string otherwise", () => {
          process.env.API_BASE_URL = 'http://api.bar.baz/v2'
          expect(env('API_BASE_URL', [ is.required(), is.url() ])).to.be.equal('http://api.bar.baz/v2')
        })
      })
    })

    /**
     *    CUSTOM PLUG
     */
    describe("can use a custom plug:", () => {
      describe(`
        \`\`\`
        import type { Context } from 'sugar-env'

        const myPlug = {
          name: 'myPlug',
          fn: <T extends string | null>(ctx: Context<T>) => {
            return (
              ctx.value === null
                ? { ...ctx, value: 'foo' }
                : ctx
            ) as Context<string>;
          }
        }
        \`\`\``, () => {
        describe("e.g.: env('FOO', [ myPlug ])", () => {
          const myPlug = {
            name: 'myPlug',
            fn: (ctx) => ctx.value === null ? { ...ctx, value: 'foo' } : ctx
          }

          it("returns `\"foo\"` when environment variable is missing", () => {
            delete process.env.FOO
            expect(env('FOO', [ myPlug ])).to.be.equal('foo')
          })

          it("returns `\"foo\"` when environment variable is empty (after trimming its whitespaces)", () => {
            process.env.FOO = '   '
            expect(env('FOO', [ myPlug ])).to.be.equal('foo')
          })

          it("returns environment variable's value (string) otherwise", () => {
            process.env.FOO = 'a b c'
            expect(env('FOO', [ myPlug ])).to.be.equal('a b c')
          })
        })
      })
    })

  })
})
