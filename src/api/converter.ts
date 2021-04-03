import { components } from '../../generated/openapi/schema'
import {
  Course,
  CourseMethod,
  CourseSchedule,
  Day,
  Module,
} from '../type/course'
import { nullToUndefined } from '../type/utils'

const DAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Intensive',
  'Appointment',
  'AnyTime',
  'Unknown',
] as const

const MODULE = [
  'SpringA',
  'SpringB',
  'SpringC',
  'FallA',
  'FallB',
  'FallC',
  'SummerVacation',
  'SpringVacation',
  'Annual',
  'Unknown',
] as const

const METHOD = ['Asynchronous', 'Synchronous', 'FaceToFace', 'Others'] as const

export function toResponseSchedule(
  s: CourseSchedule
): components['schemas']['CourseSchedule'] {
  return {
    module: toResponseModule(s.module),
    day: toResponseDay(s.day),
    period: s.period,
    room: s.room,
  }
}

export function toResponseDay(d: Day): components['schemas']['Day'] {
  return DAYS[d]
}

export function toResponseModule(
  d: Module
): components['schemas']['CourseModule'] {
  return MODULE[d]
}

export function toResponseMethod(
  d: CourseMethod
): components['schemas']['CourseMethod'] {
  return METHOD[d]
}

export function toResponseRegisteredCourse(prop: {
  id: string
  userId: string
  course: Course | null
  year: number
  name: string | null
  instructor: string | null
  credit: number | null
  methods: CourseMethod[] | null
  schedules: CourseSchedule[] | null
  tags: { id: string }[]
  memo: string
  attendance: number
  absence: number
  late: number
}): components['schemas']['RegisteredCourse'] {
  const { methods, schedules, course: baseCourse, ...c } = prop

  return {
    course: baseCourse
      ? {
          ...nullToUndefined(baseCourse),
          methods: baseCourse?.methods.map(toResponseMethod),
          schedules: baseCourse?.schedules.map(toResponseSchedule),
        }
      : undefined,
    methods: methods?.map(toResponseMethod),
    schedules: schedules?.map(toResponseSchedule),
    ...nullToUndefined(c),
  }
}

export function toInternalSchedule(
  s: components['schemas']['CourseSchedule']
): CourseSchedule {
  return {
    module: toInternalModule(s.module),
    day: toInternalDay(s.day),
    period: s.period,
    room: s.room,
  }
}

function toInternalModule(s: components['schemas']['CourseModule']): Module {
  return MODULE.indexOf(s)
}

function toInternalDay(s: components['schemas']['Day']): Day {
  return DAYS.indexOf(s)
}

export function toInternalMethod(
  m: components['schemas']['CourseMethod']
): CourseMethod {
  return METHOD.indexOf(m)
}
