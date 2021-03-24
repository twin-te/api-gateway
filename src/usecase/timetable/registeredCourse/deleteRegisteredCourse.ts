import { timetableService } from '../../../gateway/timetableService'

export function deleteRegisteredCourse(userId: string, ids: string[]) {
  return timetableService.deleteRegisteredCourses({ userId, ids })
}
