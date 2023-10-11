[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/rwillians/sugar-env.js/badge.svg?branch=master)](https://coveralls.io/github/rwillians/sugar-env.js?branch=master)
[![Build Status](https://travis-ci.org/rwillians/sugar-env.js.svg?branch=master)](https://travis-ci.org/rwillians/sugar-env.js)
![node-current](https://img.shields.io/node/v/sugar-env)

[![NPM](https://nodei.co/npm/sugar-env.png)](https://npmjs.org/package/sugar-env)

# sugar-env

Sugar code to read environment variables with default values.


## Usage

```js
const app = require('./app')
const env = require('sugar-env')

if (env.is('production')) {
    console.error('Oh no, we shouldn\'t be here!')
    process.exit(1)
}

const port = env.get('PORT')
const host = env.get(['HOST', 'BIND_ADDR'], '0.0.0.0')

app.listen({ host, port }, () => {
  console.log(`${env.current} server running at ${host}:${port}`) // "development server running at 0.0.0.0:3000"
})
```

## API

Please read the test results to learn more about `sugar-env`'s API:

```txt
  const env = require('sugar-env')
    env.current: string
      ✔ returns the current environment's name (from NODE_ENV)
      ✔ returns "development" when `NODE_ENV` isn't set
    env.DEVELOPMENT: string
      ✔ returns development's environment name: "development"
    env.TEST: string
      ✔ returns test's environment name: "test"
    env.STAGING: string
      ✔ returns staging's environment name: "staging"
    env.REVIEW: string
      ✔ returns review's environment name: "review"
    env.PRODUCTION: string
      ✔ returns production's environment name: "production"

  const env = require('sugar-env')
    env.is(environment: string): boolean
      ✔ returns `true` when the current environment name is the one specified
      ✔ returns `false` when the current environment name is different than the one specified
    [ DEPRECATED ] env(a: String).is(b: String): boolean
      ✔ returns `true` when "a" is equals "b"
      ✔ returns `false` when "a" is different than "b"

  const env = require('sugar-env')
    env.get(envVarName: string): string
      ✔ returns `null` when the environment variable doesn't exist
      ✔ returns `null` when the environment variable's value is empty
      ✔ returns the environment variable's value when it exists and it isn't empty
    env.get(envVarNames: string[]): string
      ✔ returns the value of the first environment variable which contains a non-empty value
    env.get(envVarName: string | string[], defaultValue: string): string
      ✔ returns `defaultValue` when the given environment variable doesn't exist
      ✔ returns `defaultValue` when the given environment variable's value is empty

  const env = require('sugar-env')
    env.get.boolean(envVarName: string): boolean
      ✔ returns `true` when the given environment variable's value is "1"
      ✔ returns `true` when the given environment variable's value is "true" (case insensitve)
      ✔ returns `false` for anything else
    env.get.int(envVarName: string): number
      ✔ returns `null` when the given environment variable is missing
      ✔ returns `null` when the given environment variable's value is empty
      ✔ returns `NaN` when the given environment variable's value isn't an integer
      ✔ return a `number` when the given environment variable's value is an integer
    env.get.float(envVarName: string): number
      ✔ returns `null` when the given environment variable is missing
      ✔ returns `null` when the given environment variable's value is empty
      ✔ returns `NaN` when the given environment variable's value isn't numeric
      ✔ returns a `number` when the given environment variable's value is numeric
    [ DEPRECATED ] env.get.url(envVarName: string): string
      ✔ returns `null` when the environment variable's value is missing
      ✔ returns `null` when the environment variable's value is empty
      ✔ returns the environment variable's exact value when there is already a trailing slash
      ✔ returns the environment variable's value with a trailing slash
    env.get.base64(envVarName: string): string
      ✔ returns `null` when the environment variable doesn't exist
      ✔ returns `null` when the environment variable's value is empty
      ✔ returns the environment variable's value after decoding it from base64

  const env = require('sugar-env')
    env.has(envVarName: string): boolean
      ✔ returns `true` when the given environment variable exists
      ✔ returns `false` when the given environment variable doesn't exist
```
