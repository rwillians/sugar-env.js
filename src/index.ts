//
// TYPES
//

export enum Environment {
  DEV = 'dev',
  TEST = 'test',
  CI = 'ci',
  REVIEW = 'review',
  STAGING = 'staging',
  PROD = 'prod'
}

export type Source =
  { type: 'env', name: string, value: string | null }
  | { type: 'literal', name: string, value: string | null }

type ContextLog = {
  plugName: string,
  valueBefore: any,
  valueAfter: any
}

export type Context<T = string | null> = {
  sources: Source[],
  selectedSource: Source,
  value: T,
  logs: ContextLog[]
}

export class SugerEnvError extends Error { }
export class AssertionError extends SugerEnvError { }
export class MissingRequiredError extends SugerEnvError { }
export class ExpectedNumericStringError extends SugerEnvError { }
export class ExpectedValidUrlError extends SugerEnvError { }

type Plug<I, O> = { name: string, fn: (ctx: Context<I>) => Context<O> }

type ChainablePlugs<Input, Plugs> =
  Plugs extends [infer Head, ...infer Tail]
  ? Head extends Plug<Input, infer Output>
    ? [Plug<Input, Output>, ...ChainablePlugs<Exclude<Output, Error>, Tail>]
    : Head extends Plug<any, infer Output>
      ? [never, ...ChainablePlugs<Exclude<Output, Error>, Tail>]
      : never
  : [];

type PipelinedReturnType<Input, Plugs> =
  Plugs extends [infer Head, ...infer Tail]
  ? Head extends Plug<Input, infer Output>
    ? PipelinedReturnType<Exclude<Output, Error>, Tail>
    : never
  : Input;

//
// CURRENT ENVIRONMENT
//

const normalizeEnvName = (envName: string): Environment => {
  switch (envName?.toLocaleLowerCase().trim()) {
    case 'test': return Environment.TEST;
    case 'ci': return Environment.CI;
    case 'review': return Environment.REVIEW;
    case 'staging': return Environment.STAGING;
    case 'prod': return Environment.PROD;
    default: return Environment.DEV;
  }
}

const CURRENT_ENV = () => {
  return normalizeEnvName(
    process.env.NODE_ENV === undefined
      ? Environment.DEV
      : process.env.NODE_ENV
  );
};

const isEnv = (assertionEnvironmentName: string) => {
  return assertionEnvironmentName === CURRENT_ENV();
}

const mustBeEnv = (assertionEnvironmentName: string) => {
  if (!isEnv(assertionEnvironmentName)) {
    throw new AssertionError(`Expected current environment to be "${assertionEnvironmentName}" but got "${CURRENT_ENV()}"`);
  }
}

//
// PLUGS
//

/**
 * Throws `MissingRequiredError` if the value is missing.
 */
const isRequired = () => ({
  name: 'isRequired',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      const envVars = ctx.sources.filter(s => s.type === 'env')
        .map(s => `"${s.name}"`)
        .join(', ');

      const error = new MissingRequiredError(
        `Missing required environment variable "${ctx.selectedSource.name}". ` +
        'You should make sure one of the following environment variables is ' +
        `present and that it has a non-empty value: ${envVars}`
      );

      return { ...ctx, value: error } as Context<MissingRequiredError>;
    }

    return ctx as Context<string>;
  }
})

const isDefaultTo = (defaultValue: string) => ({
  name: 'isDefaultTo',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      const source = { type: 'literal', name: 'defaultValue', value: defaultValue };

      return {
        ...ctx,
        sources: [...ctx.sources, source],
        selectedSource: source,
        value: defaultValue
      } as Context<string>;
    }

    return ctx as Context<string>;
  }
})

const isBase64 = () => ({
  name: 'isBase64',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) return ctx as Context<null>;

    return {
      ...ctx,
      value: Buffer.from(ctx.value, 'base64').toString('utf8')
    } as Context<string>
  }
})

const isBoolean = () => ({
  name: 'isBoolean',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      return { ...ctx, value: false } as Context<boolean>;
    }

    if (['true', '1', null].includes(ctx.value.toLowerCase())) {
      return { ...ctx, value: true } as Context<boolean>;
    }

    return { ...ctx, value: false } as Context<boolean>
  }
})

const isFloat = () => ({
  name: 'isFloat',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      return ctx as Context<null>;
    }

    const value = parseFloat(ctx.value);

    if (isNaN(value)) {
      const error = new ExpectedNumericStringError(
        `Expected ${ctx.selectedSource.type} value to be a valid numeric ` +
        `string but got \`"${ctx.value}"\``
      )

      return { ...ctx, value: error } as Context<ExpectedNumericStringError>
    }

    return { ...ctx, value } as Context<number>
  }
})

const isInteger = () => ({
  name: 'isInteger',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      return ctx as Context<null>;
    }

    const value = parseInt(ctx.value, 10);

    if (isNaN(value)) {
      const error = new ExpectedNumericStringError(
        `Expected ${ctx.selectedSource.type} value to be a valid numeric ` +
        `string but got \`"${ctx.value}"\``
      )

      return { ...ctx, value: error } as Context<ExpectedNumericStringError>
    }

    return { ...ctx, value } as Context<number>
  }
})

const isUrl = () => ({
  name: 'isUrl',
  fn: <T extends string | null>(ctx: Context<T>) => {
    if (ctx.value === null) {
      return ctx as Context<null>;
    }

    try {
      new URL(ctx.value);
      return ctx as Context<string>;
    } catch (err) {
      const error = new ExpectedValidUrlError(
        `Expected ${ctx.selectedSource.type} value to be a valid URL ` +
        `but got \`"${ctx.value}"\``
      )

      return { ...ctx, value: error } as Context<ExpectedValidUrlError>;
    }
  }
})

const plugs = {
  required: isRequired,
  defaultTo: isDefaultTo,
  base64: isBase64,
  boolean: isBoolean,
  float: isFloat,
  integer: isInteger,
  url: isUrl
}

//
// ENV FUNCTION
//

const getEnv = (name: string): string | null => {
  const value = process.env[name];

  if (value === undefined) return null;
  if (value.trim().length === 0) return null;

  return value;
}

const env = function env<T extends readonly Plug<any, any>[]>(
  envVarName: string | string[],
  plugs: T & ChainablePlugs<string | null, T> = [] as T & ChainablePlugs<string | null, T>
): PipelinedReturnType<string | null, typeof plugs> {
  const sources: Source[] =
    Array.isArray(envVarName)
      ? envVarName.map(name => ({ type: 'env', name, value: getEnv(name) }))
      : [{ type: 'env', name: envVarName, value: getEnv(envVarName) }];

  const selectedSource = sources.find(s => s.value !== null) || sources[0] as Source;

  let ctx = {
    sources,
    selectedSource,
    value: selectedSource.value,
    logs: []
  };

  for (const plug of plugs) {
    const valueBefore = ctx.value;
    // @ts-ignore
    const { value } = plug.fn(ctx);
    const valueAfter = value;

    if (value instanceof Error) throw value;

    ctx = {
      ...ctx,
      value: valueAfter,
      logs: [
        // @ts-ignore
        ...ctx.logs,
        // @ts-ignore
        { plugName: plug.name, valueBefore, valueAfter }
      ]
    }
  }

  // console.log(ctx);

  // @ts-ignore
  return ctx.value;
}

//
// EXPORTS
//

env.current = CURRENT_ENV;
env.DEV = Environment.DEV;
env.TEST = Environment.TEST;
env.CI = Environment.CI;
env.REVIEW = Environment.REVIEW;
env.STAGING = Environment.STAGING;
env.PROD = Environment.PROD;
env.is = isEnv;
env.mustBe = mustBeEnv;

export { env, plugs as is }
export default env;
