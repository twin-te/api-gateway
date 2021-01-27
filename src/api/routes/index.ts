import courses from './courses'
import { Express } from 'express'
import { paths } from '../../../generated/openapi/schema'
import { mapToExpress, ServerImplementation } from '../typeMapper'

export function applyRouter(app: Express) {
  const impl: Partial<ServerImplementation<paths>> = {
    ...courses,
  }
  mapToExpress(app, impl)
}
