import { components } from '../../generated/openapi/schema'
import { CourseMethod, CourseSchedule, Day, Module } from '../type/course'

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
    case Module.UnknownModule:
      return 'Unknown'
  }
}

export function toResponseMethod(
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
