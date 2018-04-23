'use strict'

const TEST = 'test'
const REVIEW = 'review'
const STAGING = 'staging'
const PRODUCTION = 'production'
const DEVELOPMENT = 'development'

/**
 * Current environment name.
 * @type {String}
 */
const current = process.env.NODE_ENV || DEVELOPMENT

/**
 * Checks if the given environment variable name is set.
 * @param  {String}   name Environment variable's name.
 * @return {Boolean}       Returns `true` if the given environment variable's
 *                         name is set within the environment variables.
 */
const has = (name) => {
  return name in process.env
}

/**
 * Gets the first given environment variables' value or returns a fallback
 * value.
 * @param  {Array[String]|String} names    Environment variable's name(s).
 * @param  {String}               fallback Fallback value.
 * @return {String}                        Environment variable's value or
 *                                         fallback value.
 */
const get = (names, fallback = null) => {
  if (!Array.isArray(names)) {
    names = [names]
  }

  const value = names.filter(name => has(name))
                     .map(name => process.env[name])
                     .shift()

  if (!value) {
    return fallback !== null
      ? fallback.toString()
      : fallback
  }

  return value
}

/**
 * Checks if the given environment name is the same as the current environment.
 * @param  {String} environment An environment name.
 * @return {Boolean}            Returns `true` if the given environment name is
 *                              the same as the current environment name.
 */
const is = (environment) => {
  return current === environment
}

module.exports = (current) => ({
  is: (environment) => current === environment
})

module.exports.is = is
module.exports.get = get
module.exports.has = has
module.exports.current = current

module.exports.TEST = TEST
module.exports.REVIEW = REVIEW
module.exports.STAGING = STAGING
module.exports.PRODUCTION = PRODUCTION
module.exports.DEVELOPMENT = DEVELOPMENT
