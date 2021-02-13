import { IRegisteredCourse } from '../../../generated/services/timetable'
import { timetableServiceClient } from '../grpc'
import { CourseMethod, CourseSchedule } from '../../type/course'
import { unwrapNullableObject, wrapNullableObject } from './nullable'
import { All } from '../../type/utils'

type Tag = { is: string; userId: string; name: string }

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
}

type CreateRegisteredCoursesProps = {
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

export const timetableService = {
  createRegisteredCourses: (prop: CreateRegisteredCoursesProps[]) =>
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
}
