import { env, is } from './index';

export const config = {
  app: {
    name: env(['APP_NAME', 'NPM_PACKAGE_name'], [ is.defaultTo('my-app') ]),
    environment: env.current(),
  },
  http: {
    port: env('PORT', [ is.defaultTo('3000'), is.integer() ]),
    bindAddress: env('BIND_ADDR', [ is.defaultTo('0.0.0.0') ]),
    cookieSecret: env('COOKIE_SECRET', [ is.required(), is.base64() ]),
  },
  postgers: {
    url: env(['TEST_DB_URL', 'DEV_DB_URL', 'DB_URL'], [ is.required(), is.url() ])
  }
}











// type Config = typeof config;
