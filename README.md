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
const host = env.get('HOST', '0.0.0.0')

app.listen({ host, port }, () => {
  console.log(`${env.current} server running at ${host}:${port}`) // "development server running at 0.0.0.0:3000"
})
```

## API

- env
    - **[.concurrent](#envcurrent--string)**
    - **[.is(name)](#envisstring-environment--boolean)**
    - **[.get(name, defaultValue)](#envgetstring-name-mixed-defaultvalue--null--mixed)**

### env.current : String

The current environment name.
Defaults to **"development"** if `NODE_ENV` environment variables is not defined or empty.

```js
const env = require('sugar-env')

console.log(`current environment is ${env.current}`)
```


### env.is(String environment) : Boolean

Checks if the given environment is equals to the current environment.

```js
const env = require('sugar-env')

if (env.is('production')) {
    console.error('this command should not be executed on production')
    process.exit(1)
}
```


### env.get(String name, Mixed defaultValue = null) : Mixed

Gets the value of the given environment variable. In case its not set, the default value will be returned.

```sh
$ FOOBAR_EMPTY= FOOBAR=foobar node sample.js
```

```js
const env = require('sugar-env')

console.log(env.get('FOOBAR'))                          // "foobar"
console.log(env.get('FOOBAR', 'default value'))         // "foobar"

console.log(env.get('FOOBAR_EMPTY'))                    // null
console.log(env.get('FOOBAR_EMPTY', 'default value'))   // "default value"

console.log(env.get('SOME_UNDEFINED_VARIABLE'))         // null
console.log(env.get('SOME_UNDEFINED_VARIABLE', 23424))  // 23424
```
