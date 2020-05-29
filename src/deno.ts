import Environments from './structures/environments.ts'
import { Base64 } from 'https://deno.land/x/bb64/mod.ts'

const process = {
  env: Deno.env.toObject()
}

type Nullable<T> = T | null

const has = (name: string): Boolean => {
  return name in process.env
    && typeof process.env[ name ] === 'string'
    && (process.env[ name ] as string).length > 0
}

function get (names: string[] | string): Nullable<string>
function get<T> (names: string[] | string, fallback: T): T
function get (names: string[] | string, fallback: Nullable<string> = null): Nullable<string> {
  if (!Array.isArray(names)) return get([ names ], fallback)

  const value = names.filter(name => has(name))
    .map(name => process.env[ name ])
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

get.base64 = _getAs<string>((value) => Base64.fromBase64String(value).toString())
get.boolean = _getAs<boolean>((value) => [ '1', 'true' ].includes(value.toLowerCase()))
get.int = _getAs<number>((value) => parseInt(value, 10))
get.float = _getAs<number>((value) => parseFloat(value))
get.url = _getAs<string>((value) => value.endsWith('/') ? value : `${value} /`)

const current = process.env.DENO_ENV || Environments.DEVELOPMENT

const is = (environment: Environments): Boolean => {
  return current === environment
}

const entrypoint = (current: Environments): { is: (x: Environments) => boolean } => ({
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
