![node-current](https://img.shields.io/node/v/sugar-env)

[![NPM](https://nodei.co/npm/sugar-env.png)](https://npmjs.org/package/sugar-env)

# sugar-env

Sugar code to read environment variables with default values and type casts.


## Usage

```js
import { env, is } from 'sugar-env';

// `config` is a fully typed object based on the "plugs" you use with the `env`
// function.
export const config = {
  app: {
    name: env(['APP_NAME', 'NPM_PACKAGE_NAME'], [ is.required() ]), // string
                                                                    // throws if not present or is empty
    ipBind: env('BIND_ADDR', [ is.defaultTo('0.0.0.0') ]), // string
    port: env('PORT', [ is.defaultTo('3000'), is.integer() ]), // number
                                                               // throws if not a numeric string
    cookieSecret: env('COOKIE_SECRET', [ is.required(), is.base64() ]), // string
                                                                        // throws if not present or is empty
  },
  flags: {
    isAdminEnabled: env('FEATURE_ADMIN_ENABLED', [ is.defaultTo('true'), is.boolean() ]), // boolean
    isServiceFooEnabled: env('FEATURE_SERVICE_FOO_ENABLED', [ is.defaultTo('false'), is.boolean() ]), // boolean
  },
  frontend: {
    baseUrl: env('FRONTEND_BASE_URL', [ is.url() ]), // string | null
                                                     // throws if not an url
  },
  profiling: {
    sampleSize: env('PROFILING_SAMPLE_SIZE', [ is.float() ]), // number | null
                                                              // throws if not a numeric string
  }
};
```

## API

Please read the test results to learn more about `sugar-env`'s API:

```txt
  import { env } from 'sugar-env'
    `env.current: string`
      ✔ returns the current environment's name (from NODE_ENV)
      ✔ returns "dev" when `NODE_ENV` isn't set
    `env.DEV: string`
      ✔ returns development's environment name: "development"
    `env.TEST: string`
      ✔ returns test's environment name: "test"
    `env.STAGING: string`
      ✔ returns staging's environment name: "staging"
    `env.REVIEW: string`
      ✔ returns review's environment name: "review"
    `env.PRODUCTION: string`
      ✔ returns production's environment name: "production"

  import { env } from 'sugar-env'
    env.is(environment: string): boolean
      ✔ returns `true` when the current environment name is equal the one specified
      ✔ returns `false` when the current environment name is different than the one specified

  import { env } from 'sugar-env'
    `env(envVarName: string): string | null`
      ✔ returns `null` when the environment variable doesn't exist
      ✔ returns `null` when the environment variable's value is empty after trimming white spaces
      ✔ returns the environment variable's value when it exists and it isn't empty
    `env(envVarNames: string[]): string | null`
      ✔ returns `null` when all given environment variables are missing
      ✔ returns `null` when the only existing environment variable is empty
      ✔ returns the value of the first found non-empty environment variable (`string`)

  import { env, is } from 'sugar-env'
    `env(envVarName: string | string[], [ is.defaultTo("foo") ]): string`
      ✔ returns the specified default value when the given environment variable doesn't exist
      ✔ returns the specified default value when the given environment variable's value is empty
    import type { Context } from 'sugar-env'
      `is.defaultTo(defaultValue: string): (ctx: Context<string | null>) => Context<string>`
        ✔ sets `ctx.value` to the given `defaultValue` when `ctx.value` is `null`
        ✔ sets `ctx.value` to the given `defaultValue` when `ctx.value` is an empty string
        ✔ returns `ctx` unchanged when `ctx.value` is a non-empty string

  import { env, is } from 'sugar-env'
    `env(envVarname: string | string[], [ is.required() ]): string`
      ✔ sets `ctx.value` to instance of `MissingRequiredError` when the given environment variable is missing
      ✔ sets `ctx.value` to instance of `MissingRequiredError` when the given environment variable is empty
      ✔ returns environment variable\'s value when it's non-empty
    import type { Context } from 'sugar-env'
      `is.required(): (ctx: Context<string | null>) => Context<string>`
        ✔ sets `ctx.value` to instance of `MissingRequiredError` when `ctx.value` is `null`
        ✔ sets `ctx.value` to instance of `MissingRequiredError` when `ctx.value` is an empty string
        ✔ returns `ctx` unchanged when `ctx.value` is a non-empty string
    import { SugarEnvError, InvalidValueError, MissingRequiredError } from 'sugar-env'
      ✔ `MissingRequiredError` extends `InvalidValueError`
      ✔ `MissingRequiredError` extends `SugarEnvError`

  import { env, is } from 'sugar-env'
    `env(envVarName: string | string[], [ is.boolean() ]): boolean | null`
      ✔ returns `false` when environment variable is missing
      ✔ returns `false` when environment variable is empty
      ✔ returns `false` when environment variable\'s value is `"0"`
      ✔ returns `false` when environment variable\'s value is `"false"`
      ✔ returns `true` when environment variable\'s value is `"1"`
      ✔ returns `true` when environment variable\'s value is `"true"`
      ✔ throws `ExpectedBooleanLikeError` when environment variable has any other value
    import type { Context } from 'sugar-env'
      `is.boolean(): (ctx: Context<string | null>) => Context<boolean | null>`
        ✔ sets `ctx.value` to `false` when `ctx.value` is null
        ✔ sets `ctx.value` to `true` when `ctx.value` is `"1"`
        ✔ sets `ctx.value` to `true` when `ctx.value` is `"true"` (case insensitive)
        ✔ sets `ctx.value` to `false` when `ctx.value` is `"0"`
        ✔ sets `ctx.value` to `false` when `ctx.value` is `"false"` (case insensitive)
        ✔ sets `ctx.value` to instance of `ExpectedBooleanLikeError` when `ctx.value` has any other value
    import { SugarEnvError, InvalidValueError, ExpectedBooleanLikeError } from 'sugar-env'
      ✔ `ExpectedBooleanLikeError` extends `InvalidValueError`
      ✔ `InvalidValueError` extends `SugarEnvError`

  import { env, is } from 'sugar-env'
    `env(envVarName: string | string[], [ is.integer() ]): number | null`
      ✔ returns `null` when the given environment variable is missing
      ✔ returns `null` when the given environment variable's value is empty
      ✔ throws `ExpectedIntegerError` when the given environment variable's value isn't numeric
      ✔ returns a `number` (integer) when the given environment variable's value is numeric
    import type { Context } from 'sugar-env'
      `is.integer(): (ctx: Context<string | null>) => Context<ExpectedIntegerError | number | null>`
        ✔ returns `ctx` unchanged when `ctx.value` is `null`
        ✔ sets `ctx.value` to instance of `ExpectedIntegerError` when `ctx.value` isn't a numeric string
        ✔ returns `number` (integer) when `ctx.value` is an integer string
        ✔ returns `number` (integer) when `ctx.value` is a float string
    import { SugarEnvError, InvalidValueError, ExpectedIntegerError } from 'sugar-env'
      ✔ `ExpectedIntegerError` extends `InvalidValueError`
      ✔ `InvalidValueError` extends `SugarEnvError`

  import { env, is } from 'sugar-env'
    `env(envVarName: string | string[], [ is.float() ]): number | null`
      ✔ returns `null` when the given environment variable is missing
      ✔ returns `null` when the given environment variable's value is empty
      ✔ throws `ExpectedFloatError` when the given environment variable's value isn't numeric
      ✔ returns a `number` (float) when the given environment variable's value is numeric
    import type { Context } from 'sugar-env'
      `is.float(): (ctx: Context<string | null>) => Context<ExpectedFloatError | number | null>`
        ✔ returns `ctx` unchanged when `ctx.value` is `null`
        ✔ sets `ctx.value` to instance of `ExpectedFloatError` when `ctx.value` isn't a numeric string
        ✔ returns `number` (float) when `ctx.value` is a float string
        ✔ returns `number` (float) when `ctx.value` is an integer string
    import { SugarEnvError, InvalidValueError, ExpectedFloatError } from 'sugar-env'
      ✔ `ExpectedFloatError` extends `InvalidValueError`
      ✔ `InvalidValueError` extends `SugarEnvError`

  import { env, is } from 'sugar-env'
    `env(envVarName: string | string[], [ is.url() ]): string | null`
      ✔ returns `null` when the environment variable's value is missing
      ✔ returns `null` when the environment variable's value is empty
      ✔ throws `ExpectedValidUrlError` when the environment variable\'s value isn't a valid URL
      ✔ returns the environment variable's value when it's a valid URL
    import type { Context } from 'sugar-env'
      `is.url(): (ctx: Context<string | null>) => Context<ExpectedUrlError | string | null>`
        ✔ returns `ctx` unchanged when `ctx.value` is `null`
        ✔ sets `ctx.value` to instance of `ExpectedUrlError` when `ctx.value` isn't a valid URL
        ✔ returns `ctx` unchanged when `ctx.value` is a valid URL string
    import { SugarEnvError, InvalidValueError, ExpectedUrlError } from 'sugar-env'
      ✔ `ExpectedUrlError` extends `InvalidValueError`
      ✔ `InvalidValueError` extends `SugarEnvError`

  import { env, is } from 'sugar-env
    `env(envVarName: string | string[], [ is.base64() ]): string | null`
      ✔ returns `null` when the environment variable doesn't exist
      ✔ returns `null` when the environment variable's value is empty
      ✔ returns the environment variable's value after decoding it from base64
    import type { Context } from 'sugar-env'
      `is.base64(): (ctx: Context) => typeof ctx`
        ✔ returns `ctx` unchanged when `ctx.value` is `null`
        ✔ sets `ctx.value` to the base64-decoded value of `ctx.value` when it is non-empty
```
