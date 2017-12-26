'use strict'

/**
 * Current environment name.
 * @type {String}
 */
const current = process.env.NODE_ENV || 'development'

/**
 * Checks if the given environment variable name is set.
 * @param  {String}   name Environment variable's name.
 * @return {Boolean}       Returns `true` if the given environment variable's
 *                         name is set within the environment variables.
 */
const has = (name) => {
  return process.env.hasOwnProperty(name)
}

/**
 * Gets the given environment variable's value or returns a default value.
 * @param  {String}         name     Environment variable's name.
 * @param  {String|Number}  fallback Default value.
 * @return {Mixed}                   Environment variable's value or default
 *                                   value.
 */
const get = (name, fallback = null) => {
  return has(name) ? process.env[name] : fallback
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

module.exports = get
module.exports.is = is
module.exports.get = get
module.exports.has = has
module.exports.current = current
