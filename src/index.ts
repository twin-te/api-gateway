import { logger } from './logger'
import { startServer } from './api'

async function main() {
  logger.info('service is starting.')
  await startServer()
  logger.info('ready.')
}

main()
