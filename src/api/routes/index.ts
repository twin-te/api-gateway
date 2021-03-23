import courses from './courses'
import registeredCourses from './registeredCourses'
import tags from './tags'
import schoolCalendar from './schoolCalendar'
import timetable from './timetable'
import donation from './donation'
import user from './user'
import { Express } from 'express'
import { paths } from '../../../generated/openapi/schema'
import { mapToExpress, ServerImplementation } from '../typeMapper'

export function applyRouter(app: Express) {
  const impl: Partial<ServerImplementation<paths>> = {
    ...courses,
    ...registeredCourses,
    ...tags,
    ...schoolCalendar,
    ...timetable,
    ...donation,
    ...user,
  }
  mapToExpress(app, impl)
}
