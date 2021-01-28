import { ApiEndpointHandler, PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { v4 } from 'uuid'
import { getCoursesByCodeUseCase } from '../../usecase/getCourseByCode'
import {
  Course,
  CourseMethod,
  CourseSchedule,
  Day,
  Module,
} from '../../type/course'

type CourseHandler = PartialServerImplementation<
  paths,
  '/courses/{year}/{code}'
> &
  PartialServerImplementation<paths, '/courses/search'>

const handlers: CourseHandler = {
  '/courses/{year}/{code}': {
    get: async (req) => ({
      code: 200,
      body: toResponseCourse(
        (
          await getCoursesByCodeUseCase([
            { year: req.path.year, code: req.path.code },
          ])
        )[0]
      ),
    }),
  },
  '/courses/search': {
    post: (req) => ({
      code: 200,
      body: [
        {
          id: v4(),
          name: 'test',
          code: 'CODE',
          year: 2020,
          instructor: 'inst',
          credit: 1.5,
          overview: 'overview',
          remarks: 'remarks',
          recommendedGrades: [1, 2],
          methods: ['Asynchronous'],
          schedules: [
            { module: 'SpringA', day: 'Mon', period: 1, room: 'room' },
          ],
        },
      ],
    }),
  },
}

export default handlers

function toResponseCourse({
  schedules,
  method,
  ...obj
}: Course): components['schemas']['Course'] {
  return {
    ...obj,
    methods: method.map(toResponseMethod),
    schedules: schedules.map(toResponseSchedule),
  }
}

function toResponseSchedule(
  s: CourseSchedule
): components['schemas']['CourseSchedule'] {
  return {
    module: toResponseModule(s.module),
    day: toResponseDay(s.day),
    period: s.period,
    room: s.room,
  }
}

function toResponseDay(d: Day): components['schemas']['Day'] {
  switch (d) {
    case Day.Sun:
      return 'Sun'
    case Day.Mon:
      return 'Mon'
    case Day.Tue:
      return 'Tue'
    case Day.Wed:
      return 'Wed'
    case Day.Thu:
      return 'Thu'
    case Day.Fri:
      return 'Fri'
    case Day.Sat:
      return 'Sat'
    case Day.Intensive:
      return 'Intensive'
    case Day.Appointment:
      return 'Appointment'
    case Day.AnyTime:
      return 'AnyTime'
    case Day.UnknownDay:
      return 'Unknown'
  }
}

function toResponseModule(d: Module): components['schemas']['CourseModule'] {
  switch (d) {
    case Module.SpringA:
      return 'SpringA'
    case Module.SpringB:
      return 'SpringB'
    case Module.SpringC:
      return 'SpringC'
    case Module.FallA:
      return 'FallA'
    case Module.FallB:
      return 'FallB'
    case Module.FallC:
      return 'FallC'
    case Module.Annual:
      return 'Annual'
    case Module.SummerVacation:
      return 'SummerVacation'
    case Module.SpringVacation:
      return 'SpringVacation'
    case Module.Unknown:
      return 'Unknown'
  }
}

function toResponseMethod(
  d: CourseMethod
): components['schemas']['CourseMethod'] {
  switch (d) {
    case CourseMethod.OnlineAsynchronous:
      return 'Asynchronous'
    case CourseMethod.OnlineSynchronous:
      return 'Synchronous'
    case CourseMethod.FaceToFace:
      return 'FaceToFace'
    case CourseMethod.Others:
      return 'Others'
  }
}
