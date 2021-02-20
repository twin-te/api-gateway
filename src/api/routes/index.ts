import courses from './courses'
import registeredCourses from './registeredCourses'
import tags from './tags'
import { Express } from 'express'
import { paths } from '../../../generated/openapi/schema'
import { mapToExpress, ServerImplementation } from '../typeMapper'

export function applyRouter(app: Express) {
  const impl: Partial<ServerImplementation<paths>> = {
    ...courses,
    ...registeredCourses,
    ...tags,
  }
  mapToExpress(app, impl)
}
