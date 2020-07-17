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

- sugar-env:
    - **.concurrent: String**: returns the current environment name;
    - **.is(String environment): Boolean**: checks if the given environment matchs the current environment name;
    - **.get(Array[String]|String names, String fallback = null): String**: gets the given environment variable or returns the fallback value. If an array of environment variables is given, the value of the first one to be found is returned.

---

```txt
  const env = require('sugar-env')
    env.get.int(name: String): Number
      ✓ returns the given env as number
      ✓ returns `null` when the parameter is null
      ✓ returns `NaN` when the parameter is NaN
    env.get.float(name: String): Number
      ✓ returns the given env as number
      ✓ returns `null` when the parameter is null
      ✓ returns `NaN` when the parameter is NaN
    env.get.url(name: String): String
      ✓ returns the given env with trailing slash
      ✓ returns `null` when the parameter is null
      ✓ returns the value when there is already a trailing slash
    env.get.base64(name: String): String
      ✓ returns the given env as plain text
      ✓ returns `null` when the parameter is null

  const env = require('sugar-env')
    env(current: String).is(environment: String): Boolean
      ✓ returns `true` if the given environment name is the current environment
      ✓ returns `false` when the given environment name doesn't match the current environment

  const env = require('sugar-env')
    env.ENVIRONMENT: String
      ✓ Should return the test environment string
      ✓ Should return the development environment string
      ✓ Should return the staging environment string
      ✓ Should return the production environment string
      ✓ Should return the review environment string

  const env = require('sugar-env')
    env.get(names: Array[String]|String, fallback: String): String
      ✓ returns the environment value when the variable exists
      ✓ returns `null` by default when the given environment variable(s) doesn't exists
      ✓ fallback value can be changed by setting the second argument
      ✓ returns the first found environment variable's value when an array of names is given
      ✓ returns the fallback value when none of the given environment variable names were found

  const env = require('sugar-env')
    env.has(name: String): Boolean
      ✓ returns `true` if exists an environment variable with the given name
      ✓ returns `false` when there's no environment variable with the given name

  const env = require('sugar-env')
    env.is(environment: String): Boolean
      ✓ returns `true` if the given environment name is the current environment
      ✓ returns `false` when the given environment name doesn't match the current environment

  27 passing (15ms)
```
