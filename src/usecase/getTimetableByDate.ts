import { Dayjs } from 'dayjs'
import { schoolCalendarService } from '../gateway/schoolCalendarService'
import { CourseSchedule, Day, Module } from '../type/course'
import { getRegisteredCourses } from './getRegisteredCourse'

export async function getTimetableByDate(userId: string, date: Dayjs) {
  const nendo = date.month() < 4 ? date.year() - 1 : date.year()

  const [courses, module, events] = await Promise.all([
    getRegisteredCourses(userId, nendo),
    schoolCalendarService.getModuleTermByDate(date),
    schoolCalendarService.getEventsByDate(date),
  ])

  const day = date.day() as Day

  return {
    courses: courses.filter((c) => {
      const schedules = (c.schedules ?? c.course?.schedules) as CourseSchedule[]
      return schedules.find(
        (s) =>
          (s.module === module.module || s.module === Module.Annual) &&
          s.day === day
      )
    }),
    module,
    events,
  }
}
