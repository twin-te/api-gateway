import { logger } from './logger'
import { startApiServer } from './api'

async function main() {
  logger.info('service is starting.')
  await startApiServer()
  logger.info('ready.')
}

main()
