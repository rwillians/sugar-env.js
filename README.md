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
> mocha test/*.test.js --check-leaks --full-trace --use_strict --recursive

  const env = require('sugar-env')
    env(current).is(environment: String): Boolean
      ✓ returns `true` if the given environment name is the current environment
      ✓ returns `false` when the given environment name doesn't match the current environment

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


  11 passing (8ms)
```
