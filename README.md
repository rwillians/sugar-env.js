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

Please read the test results to learn more about `sugar-env`'s API, they were wrote so it works as documentation:

```txt
import { env } from 'sugar-env'
  env[string]: string
    e.g.: `env.DEV`
      - returns `"dev", which is the normalized development environment's name
    e.g.: `env.TEST`
      - returns `"test"`, which is the normalized name of the test environment
    e.g.: `env.STAGING`
      - returns `"staging"`, which is the normalized name of the staging environment
    e.g.: `env.REVIEW`
      - returns `"review"`, which is the normalized name of the review environment
    e.g.: `env.PROD`
      - returns `"prod"`, which is the normalized name of the production environment
    e.g.: `env.current`
      - returns `"dev"` when `process.env.NODE_ENV` is empty
      - returns `"dev"` when `process.env.NODE_ENV` isn't set
      - returns `"dev"` when `process.env.NODE_ENV` isn't one of: `"dev"`, `"test"`, `"staging"`, `"review"` or `"prod"`
      - returns the value of `process.env.NODE_ENV` otherwise

import { env } from 'sugar-env'
  env.is(assertionEnvironmentName: string): boolean
    e.g.: `env.is(env.PROD)`
      - returns `true` when current environment's name is equal `assertionEnvironmentName`
      - returns `false` otherwise

import { env } from 'sugar-env'
  env(envVarName: string | string[]): string | null
    e.g.: `env('S3_KEY_SECRET')`
      - returns `null` when environment variable is missing
      - returns `null` when environment variable is empty (after trimming its whitespaces)
      - returns the environment variable's value otherwise
    e.g.: `env(['PROD_S3_KEY_SECRET', 'S3_KEY_SECRET'])`
      - returns `null` when all environment variables are missing
      - returns `null` when the only environment variable present is empty (after trimming its whitespaces)
      - returns the value of the first found non-empty environment variable (`string`)

import { env, is } from 'sugar-env'
  env<T>(environmentName: string | string[], plugs: T & ChainablePlugs<string | null, T>): PipelinedReturnType<string | null, typeof plugs>
    using built-in plugs:
      `is.required()`
        e.g.: `env('API_SECRET_KEY', [ is.required() ])`
          - throws `MissingRequiredError` when environment variable is missing
          - throws `MissingRequiredError` when environment variable's value is empty (after trimming its whitespaces)
          - returns a `string` otherwise
      `is.defaultTo(defaultValue: string)`
        e.g.: `env('PORT', [ is.defaultTo('3000') ])`
          - returns the given default value when environment variable is missing
          - returns the given default value when environment variable's value is empty (after trimming its whitespaces)
          - returns a `string` otherwise
      `is.boolean()`
        e.g.: `env('FEATURE_ADMIN_ENABLED', [ is.boolean() ])`
          - returns `true` when environment variable's value is `"1"`
          - returns `true` when environment variable's value is `"true"` (case insensitive)
          - returns `false` otherwise
      `in.integer()`
        e.g.: `env('PORT', [ is.integer() ])`
          - returns `null` when the environment variable is missing
          - returns `null` when environment variable's value is empty (after trimming its whitespaces)
          - throws `ExpectedNumericStringError` if the environment variable's value isn't an integer string
          - returns a `number` (integer) otherwise
      `is.float()`
        e.g.: `env('SAMPLING_SIZE', [ is.float() ])`
          - returns `null` when the environment variable is missing
          - returns `null` when the environment variable's value is empty (after trimming its whitespaces)
          - throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string
          - returns a `number` (float) otherwise
      `is.url()`
        e.g.: `env('API_BASE_URL, [ is.url() ])`
          - returns `null` when the environment variable is missing
          - returns `null` when the environment variable's value is empty (after trimming its whitespaces)
          - throws `ExpectedValidUrlError` when the environment variable's value isn't a valid URL string
          - returns a `string` otherwise
      `is.base64()`
        e.g.: `env('COOKIE_SECRET, [ is.base64() ])`
          - returns `null` when the environment variable is missing
          - returns `null` when the environment variable's value is empty (after trimming its whitespaces)
          - returns the decoded base64 `string` otherwise
    plugs can be combined:
      e.g.: `env('PORT', [ is.defaultTo('3000'), is.integer() ])`
        - throws `ExpectedNumericStringError` if the environment variable's value isn't a numeric string
        - throws `ExpectedNumericStringError` if the default value isn't a numeric string
        - returns the given default value as a number (integer) when environment variable is missing
        - returns the given default value as a number (integer) when environment variable's value is empty (after trimming its whitespaces)
        - returns a `number` (integer) otherwise
      e.g.: `env('API_BASE_URL', [ is.required(), is.url() ])`
        - throws `MissingRequiredError` if the environment variable is missing
        - throws `MissingRequiredError` if the environment variable's value is empty (after trimming its whitespaces)
        - throws `ExpectedValidUrlError` if the environment variable's value isn't a valid URL string
        - returns a `string` otherwise
    can use a custom plug:

      ```
      import type { Context } from 'sugar-env'

      const myPlug = (ctx: Context) => {
        return ctx.value === null
          ? { ...ctx, value: 'foo' }
          : ctx
      }
      ```
        e.g.: env('FOO', [ myPlug ])
          - returns `"foo"` when environment variable is missing
          - returns `"foo"` when environment variable is empty (after trimming its whitespaces)
          - returns environment variable's value (`string`) otherwise
```
