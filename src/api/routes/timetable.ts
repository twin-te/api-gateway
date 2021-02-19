import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import {
  createCustomRegisteredCourse,
  createRegisteredCourse,
} from '../../usecase/createRegisteredCourse'
import {
  toInternalMethod,
  toInternalSchedule,
  toResponseMethod,
  toResponseSchedule,
} from '../converter'
import { Course, CourseMethod, CourseSchedule } from '../../type/course'
import { nullToUndefined } from '../../type/utils'
import { getRegisteredCourses } from '../../usecase/getRegisteredCourse'
import { updateRegisteredCourse } from '../../usecase/updateRegisteredCourse'
import { deleteRegisteredCourse } from '../../usecase/deleteRegisteredCourse'

type TimetableHandler = PartialServerImplementation<
  paths,
  '/registered-courses' | '/registered-courses/{id}' // | '/tags' | '/tags/{id}'
>
const handler: TimetableHandler = {
  '/registered-courses': {
    post: async ({ body, userId }) => {
      if ('code' in body)
        return {
          code: 200,
          body: toResponseRegisteredCourse(
            (await createRegisteredCourse(userId, [body]))[0]
          ),
        }
      else {
        const { methods, schedules, ...s } = body
        return {
          code: 200,
          body: toResponseRegisteredCourse(
            (
              await createCustomRegisteredCourse(userId, [
                {
                  methods: methods.map(toInternalMethod),
                  schedules: schedules.map(toInternalSchedule),
                  ...s,
                },
              ])
            )[0]
          ),
        }
      }
    },
    get: async (req) => {
      return {
        code: 200,
        body: (await getRegisteredCourses(req.userId, req.query.year)).map(
          toResponseRegisteredCourse
        ),
      }
    },
  },
  '/registered-courses/{id}': {
    put: async (req) => {
      const { methods, schedules, ...c } = req.body
      return {
        code: 200,
        body: toResponseRegisteredCourse(
          (
            await updateRegisteredCourse(req.userId, [
              {
                ...c,
                methods: methods?.map(toInternalMethod),
                schedules: schedules?.map(toInternalSchedule),
                id: req.path.id,
              },
            ])
          )[0]
        ),
      }
    },
    get: (req) => {
      return {
        code: 500,
        body: {
          message: '',
          errors: [],
        },
      }
    },
    delete: async (req) => {
      let n!: never
      await deleteRegisteredCourse([req.path.id])
      return {
        code: 204,
        body: n,
        header: {},
      }
    },
  },
}

export default handler

function toResponseRegisteredCourse(prop: {
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
  const { methods, schedules, course: baseCourse, userId, ...c } = prop

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
    userID: userId,
    ...nullToUndefined(c),
  }
}
