import dayjs from 'dayjs'
import { paths } from '../../../generated/openapi/schema'
import { getTimetableByDate } from '../../usecase/getTimetableByDate'
import { PartialServerImplementation } from '../typeMapper'
import {
  toInternalMethod,
  toInternalSchedule,
  toResponseMethod,
  toResponseSchedule,
  toResponseRegisteredCourse,
  toResponseModule,
} from '../converter'
import { toResponseEvent } from './schoolCalendar'

type TimetableHandler = PartialServerImplementation<paths, '/timetable/{date}'>

const MODULE = [
  'SpringA',
  'SpringB',
  'SpringC',
  'FallA',
  'FallB',
  'FallC',
  'SummerVacation',
  'SpringVacation',
] as const

const handler: TimetableHandler = {
  '/timetable/{date}': {
    async get({ path, userId }) {
      const res = await getTimetableByDate(userId, dayjs(path.date))
      return {
        code: 200,
        body: {
          courses: res.courses.map(toResponseRegisteredCourse),
          module: MODULE[res.module],
          events: res.events.map(toResponseEvent),
        },
      }
    },
  },
}

export default handler
