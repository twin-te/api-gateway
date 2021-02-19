import { components } from '../../generated/openapi/schema'
import { CourseMethod, CourseSchedule, Day, Module } from '../type/course'

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
  'Annual',
  'SummerVacation',
  'SpringVacation',
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

function toResponseDay(d: Day): components['schemas']['Day'] {
  return DAYS[d]
}

function toResponseModule(d: Module): components['schemas']['CourseModule'] {
  return MODULE[d]
}

export function toResponseMethod(
  d: CourseMethod
): components['schemas']['CourseMethod'] {
  return METHOD[d]
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
