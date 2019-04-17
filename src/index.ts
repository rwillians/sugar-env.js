import Environments from './structures/environments'

type Nullable<T> = T | null

const has = (name: string): Boolean => {
  return name in process.env
    && typeof process.env[name] === 'string'
    && (process.env[name] as string).length > 0
}

function get (names: string[] | string): Nullable<string>
function get<T> (names: string[] | string, fallback: T): T
function get (names: string[] | string, fallback: Nullable<string> = null): Nullable<string> {
  if (!Array.isArray(names)) return get([names], fallback)

  const value = names.filter(name => has(name))
    .map(name => process.env[name])
    .shift()

  if (!value) return fallback !== null ? fallback.toString() : fallback

  return value
}

interface IConversionFunction<T> {
  (value: string): Nullable<T>
}

function _getAs<T> (fn: IConversionFunction<T>) {
  function getAs (names: string | string[]): Nullable<T>
  function getAs (names: string | string[], fallback: T): T
  function getAs (names: string | string[], fallback: Nullable<T> = null) {
    const value = get(names)
    if (value === null) {
      return fallback
    }

    return fn(value)
  }

  return getAs
}

get.base64 = _getAs<String>((value) => Buffer.from(value, 'base64').toString('utf8'))
get.boolean = _getAs<Boolean>((value) => [ '1', 'true' ].includes(value.toLowerCase()))
get.int = _getAs<Number>((value) => parseInt(value, 10))
get.float = _getAs<Number>((value) => parseFloat(value))
get.url = _getAs<String>((value) => value.endsWith('/') ? value : `${value}/`)

const current = process.env.NODE_ENV || Environments.DEVELOPMENT

const is = (environment: Environments): Boolean => {
  return current === environment
}

const entrypoint = (current: Environments): { is: (x: Environments) => Boolean } => ({
  is: (environment: Environments) => current === environment
})

entrypoint.is = is
entrypoint.get = get
entrypoint.has = has
entrypoint.current = current

const TEST = Environments.TEST
const REVIEW = Environments.REVIEW
const STAGING = Environments.STAGING
const PRODUCTION = Environments.PRODUCTION
const DEVELOPMENT = Environments.DEVELOPMENT

entrypoint.TEST = TEST
entrypoint.REVIEW = REVIEW
entrypoint.STAGING = STAGING
entrypoint.PRODUCTION = PRODUCTION
entrypoint.DEVELOPMENT = DEVELOPMENT

export {
  has,
  get,
  is,
  current,
  TEST,
  REVIEW,
  STAGING,
  PRODUCTION,
  DEVELOPMENT
}

export default entrypoint
module.exports = entrypoint
