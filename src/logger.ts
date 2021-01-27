import log4js from 'log4js'

log4js.configure({
  appenders: { std: { type: 'stdout' } },
  categories: {
    default: { appenders: ['std'], level: process.env.LOG_LEVEL ?? 'info' },
  },
})

export const logger = log4js.getLogger()
export const api = log4js.getLogger('api')
