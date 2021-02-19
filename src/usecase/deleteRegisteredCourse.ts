import { timetableService } from '../gateway/timetableService'

export function deleteRegisteredCourse(ids: string[]) {
  return timetableService.deleteRegisteredCourses(ids)
}
