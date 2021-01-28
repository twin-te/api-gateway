export enum CourseMethod {
  OnlineAsynchronous,
  OnlineSynchronous,
  FaceToFace,
  Others,
}

export enum Module {
  SpringA,
  SpringB,
  SpringC,
  FallA,
  FallB,
  FallC,
  SummerVacation,
  SpringVacation,
  Annual,
  Unknown,
}

export enum Day {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
  Intensive,
  Appointment,
  AnyTime,
  UnknownDay,
}

export type CourseSchedule = {
  module: Module
  day: Day
  period: number
  room: string
}

export type Course = {
  id: string
  year: number
  code: string
  name: string
  instructor: string
  credit: number
  overview: string
  remarks: string
  recommendedGrades: number[]
  method: CourseMethod[]
  schedules: CourseSchedule[]
}
