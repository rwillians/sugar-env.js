import Environments from './structures/environments'

type Nullable<T> = T | null

interface IConversionFunction<T> {
  (value: string): Nullable<T>
}

function _getAs<T> (fn: IConversionFunction<T>) {
  return (names: string | string[], fallback: Nullable<string>) => {
    const value = get(names, fallback)
    if (!value) return value
    return fn(value)
  }
}

/**
 * Current environment name.
 * @type {String}
 */
export const current = process.env.NODE_ENV || Environments.DEVELOPMENT

/**
 * Checks if the given environment variable name is set.
 * @param  {String}   name Environment variable's name.
 * @return {Boolean}       Returns `true` if the given environment variable's
 *                         name is set within the environment variables.
 */
export function has (name: string): Boolean {
  return name in process.env && typeof process.env[name] === 'string' && (process.env[name] as string).length > 0
}

/**
 * Gets the first given environment variables' value or returns a fallback
 * value.
 * @param  {Array[String]|String} names    Environment variable's name(s).
 * @param  {String}               fallback Fallback value.
 * @return {String}                        Environment variable's value or
 *                                         fallback value.
 */
export function get (names: string[] | string, fallback: Nullable<string> = null): Nullable<string> {
  if (!Array.isArray(names)) return get([names], fallback)

  const value = names.filter(name => has(name))
    .map(name => process.env[name])
    .shift()

  if (!value) return fallback !== null ? fallback.toString() : fallback

  return value
}

/**
 * Decodes value from base64.
 * @param  {Array} names Function arguments.
 * @return {Number}     Number or null.
 */
get.base64 = _getAs((value) => Buffer.from(value, 'base64').toString('utf8'))

/**
 * Casts the value into integer.
 * @param  {Array} names Function arguments.
 * @return {Number}     Number or null.
 */
get.int = _getAs((value) => parseInt(value))

/**
 * Casts the value into float.
 * @param  {Array} args Function arguments.
 * @return {Number}     Number or null.
 */
get.float = _getAs((value) => parseFloat(value))

/**
 * Ensures trailing slash.
 * @param  {Array} args Function arguments.
 * @return {String}     String or null.
 */
get.url = _getAs((value) => value.endsWith('/') ? value : `${value}/`)

/**
 * Checks if the given environment name is the same as the current environment.
 * @param  {String} environment An environment name.
 * @return {Boolean}            Returns `true` if the given environment name is the same as the current environment name.
 */
function is (environment: Environments): Boolean {
  return current === environment
}

module.exports = (current: Environments): { is: (x: Environments) => Boolean } => ({
  is: (environment: Environments) => current === environment
})

module.exports.is = is
module.exports.get = get
module.exports.has = has
module.exports.current = current

module.exports.TEST = Environments.TEST
module.exports.REVIEW = Environments.REVIEW
module.exports.STAGING = Environments.STAGING
module.exports.PRODUCTION = Environments.PRODUCTION
module.exports.DEVELOPMENT = Environments.DEVELOPMENT
