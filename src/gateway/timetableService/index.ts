import {
  IRegisteredCourse,
  TimetableService,
} from '../../../generated/services/timetable'

import { CourseMethod, CourseSchedule } from '../../type/course'
import { unwrapNullableObject, wrapNullableObject } from './nullable'
import { All } from '../../type/utils'
import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'

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
  process.env.TIMETABLE_SERVICE_URL ?? 'timetable:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(timetableServiceClient)

export const timetableService = {
  createRegisteredCourses: methodWrapper(
    timetableServiceClient.createRegisteredCourses,
    {
      to: (prop: createRegisteredCoursesProps[]) => ({
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
      }),
      from: (res) => res.courses.map(unwrapNullableObject),
    }
  ),
  getRegisteredCoursesByYear: methodWrapper(
    timetableServiceClient.getRegisteredCoursesByYear,
    {
      from: (res) => res.courses.map(unwrapNullableObject),
    }
  ),
  getRegisteredCourse: methodWrapper(
    timetableServiceClient.getRegisteredCourse,
    {
      from: (res) => unwrapNullableObject(res),
    }
  ),
  updateRegisteredCourses: methodWrapper(
    timetableServiceClient.updateRegisteredCourses,
    {
      to: (prop: updateRegisteredCoursesProps[]) => ({
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
      }),
      from: (res) => res.courses.map(unwrapNullableObject),
    }
  ),
  deleteRegisteredCourses: methodWrapper(
    timetableServiceClient.deleteRegisteredCourses,
    {
      from: (res) => unwrapNullableObject(res),
    }
  ),
  createTags: methodWrapper(timetableServiceClient.createTags, {
    to: (tags: CreateTagInput[]) => ({ tags }),
    from: (res) => res.tags,
  }),
  getTags: methodWrapper(timetableServiceClient.getTags, {
    to: (userId: string) => ({ userId }),
    from: (req) => req.tags,
  }),
  updateTags: methodWrapper(timetableServiceClient.updateTags, {
    to: (tags: Tag[]) => ({ tags }),
    from: (res) => res.tags,
  }),
  deleteTags: methodWrapper(timetableServiceClient.deleteTags),
}
