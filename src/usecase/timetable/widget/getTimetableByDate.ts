import { Dayjs } from 'dayjs'
import {
  EventType,
  IEvent,
  IModuleTerm,
} from '../../../../generated/services/schoolCalendar'
import {
  SchoolCalendarEvent,
  schoolCalendarService,
} from '../../../gateway/schoolCalendarService'
import { CourseSchedule, Day, Module } from '../../../type/course'
import { RegisteredCourse } from '../../../type/regissteredCourse'
import { All } from '../../../type/utils'
import { getRegisteredCoursesByYear } from '../registeredCourse/getRegisteredCoursesByYear'

type Result = {
  courses: RegisteredCourse[]
  module?: All<IModuleTerm>
  events: SchoolCalendarEvent[]
}

export async function getTimetableByDate(
  userId: string,
  date: Dayjs
): Promise<Result> {
  const nendo = date.month() < 3 ? date.year() - 1 : date.year()

  const [courses, events] = await Promise.all([
    getRegisteredCoursesByYear(userId, nendo),
    schoolCalendarService.getEventsByDate(date),
  ])

  let module: All<IModuleTerm>
  try {
    module = await schoolCalendarService.getModuleTermByDate(date)
  } catch (e) {
    // 指定された日程が範囲外だった場合
    return {
      courses: [],
      events: [],
    }
  }

  // 休日は授業なしのため空配列を返す
  if (
    events.find(
      (e) => e.type === EventType.Holiday || e.type === EventType.PublicHoliday
    )
  )
    return {
      courses: [],
      module,
      events,
    }

  // 振替日程があるときに値が入る
  const substituteDay = events.find((e) => e.type === EventType.SubstituteDay)

  const day = (substituteDay?.changeTo ?? date.day()) as Day

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
