import {
  IRegisteredCourse,
  TimetableService,
} from '../../../generated/services/timetable'

import { CourseMethod, CourseSchedule } from '../../type/course'
import { unwrapNullableObject, wrapNullableObject } from './nullable'
import { All } from '../../type/utils'
import { createClient } from '../grpc'

type Tag = { id: string; userId: string; name: string }

type CreateTagInput = { userId: string; name: string }

type RegisteredCourse = {
  id: string
  userId: string
  courseId: string | null
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
}

type createRegisteredCoursesProps = {
  userId: string
  courseId?: string
  year: number
  name?: string
  instructor?: string
  credit?: number
  methods?: CourseMethod[]
  schedules?: CourseSchedule[]
  tags: { id: string }[]
}

type updateRegisteredCoursesProps = {
  id: string
  userId: string
  courseId?: string
  year: number
  name?: string
  instructor?: string
  credit?: number
  methods?: CourseMethod[]
  schedules?: CourseSchedule[]
  tags: { id: string }[]
  memo: string
  attendance: number
  absence: number
  late: number
}

const timetableServiceClient = createClient(
  ['Nullable.proto', 'Message.proto', 'TimetableService.proto'].map(
    (p) => `services/timetable-service/protos/${p}`
  ),
  TimetableService,
  'timetable:50051'
)

export const timetableService = {
  createRegisteredCourses: (prop: createRegisteredCoursesProps[]) =>
    new Promise<RegisteredCourse[]>((resolve, reject) => {
      timetableServiceClient.createRegisteredCourses(
        {
          courses: prop.map((c) =>
            wrapNullableObject(c, [
              'name',
              'courseId',
              'instructor',
              'credit',
              'methods',
              'schedules',
            ])
          ),
        },
        (err, res) => {
          if (err || !res?.courses) reject(err)
          else {
            resolve(
              (res.courses as All<IRegisteredCourse>[]).map(
                unwrapNullableObject
              )
            )
          }
        }
      )
    }),
  getRegisteredCourses: (userId: string, year: number) =>
    new Promise<RegisteredCourse[]>((resolve, reject) => {
      timetableServiceClient.getRegisteredCourses(
        { userId, year },
        (err, res) => {
          if (err || !res) reject(err)
          else
            resolve(
              (res.courses as All<IRegisteredCourse>[]).map(
                unwrapNullableObject
              )
            )
        }
      )
    }),
  updateRegisteredCourses: (prop: updateRegisteredCoursesProps[]) =>
    new Promise<RegisteredCourse[]>((resolve, reject) => {
      timetableServiceClient.updateRegisteredCourses(
        {
          courses: prop.map((c) =>
            wrapNullableObject(c, [
              'name',
              'courseId',
              'instructor',
              'credit',
              'methods',
              'schedules',
            ])
          ),
        },
        (err, res) => {
          if (err || !res) reject(err)
          else
            resolve(
              (res.courses as All<IRegisteredCourse>[]).map(
                unwrapNullableObject
              )
            )
        }
      )
    }),
  deleteRegisteredCourses: (userId: string, ids: string[]) =>
    new Promise<void>((resolve, reject) => {
      timetableServiceClient.deleteRegisteredCourses(
        { userId, ids },
        (err, res) => {
          if (err || !res) reject(err)
          else resolve()
        }
      )
    }),
  createTags: (tags: CreateTagInput[]) =>
    new Promise<Tag[]>((resolve, reject) => {
      timetableServiceClient.createTags({ tags }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.tags as Tag[])
      })
    }),
  getTags: (userId: string) =>
    new Promise<Tag[]>((resolve, reject) => {
      timetableServiceClient.getTags({ userId }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.tags as Tag[])
      })
    }),
  updateTags: (tags: Tag[]) =>
    new Promise<Tag[]>((resolve, reject) => {
      timetableServiceClient.updateTags({ tags }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.tags as Tag[])
      })
    }),
  deleteTags: (userId: string, ids: string[]) =>
    new Promise<void>((resolve, reject) => {
      timetableServiceClient.deleteTags({ userId, ids }, (err, res) => {
        if (err || !res) reject(res)
        else resolve()
      })
    }),
}
