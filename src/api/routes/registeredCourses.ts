import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import {
  createCustomRegisteredCourse,
  createRegisteredCourse,
} from '../../usecase/timetable/registeredCourse/createRegisteredCourse'
import {
  toInternalMethod,
  toInternalSchedule,
  toResponseMethod,
  toResponseSchedule,
  toResponseRegisteredCourse,
} from '../converter'
import { Course, CourseMethod, CourseSchedule } from '../../type/course'
import { nullToUndefined } from '../../type/utils'
import { getRegisteredCoursesByYear } from '../../usecase/timetable/registeredCourse/getRegisteredCoursesByYear'
import { updateRegisteredCourse } from '../../usecase/timetable/registeredCourse/updateRegisteredCourse'
import { deleteRegisteredCourse } from '../../usecase/timetable/registeredCourse/deleteRegisteredCourse'
import { getRegisteredCourseUseCase } from '../../usecase/timetable/registeredCourse/getRegisteredCourse'

type RegisteredCourseHandler = PartialServerImplementation<
  paths,
  '/registered-courses' | '/registered-courses/{id}'
>
const handler: RegisteredCourseHandler = {
  '/registered-courses': {
    post: async ({ body, userId }) => {
      if ('code' in body)
        return {
          code: 200,
          body: toResponseRegisteredCourse(
            (await createRegisteredCourse(userId, [body]))[0]
          ),
        }
      else if (Array.isArray(body)) {
        const res = await createRegisteredCourse(userId, body)
        return {
          code: 200,
          body: res.map(toResponseRegisteredCourse),
        }
      } else {
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
        body: (
          await getRegisteredCoursesByYear(req.userId, req.query.year)
        ).map(toResponseRegisteredCourse),
      }
    },
  },
  '/registered-courses/{id}': {
    put: async (req) => {
      const { methods, schedules, course, ...c } = req.body
      return {
        code: 200,
        body: toResponseRegisteredCourse(
          (
            await updateRegisteredCourse(req.userId, [
              {
                ...c,
                courseId: course?.id,
                methods: methods?.map(toInternalMethod),
                schedules: schedules?.map(toInternalSchedule),
                id: req.path.id,
              },
            ])
          )[0]
        ),
      }
    },
    get: async ({ path, userId }) => {
      const course = await getRegisteredCourseUseCase(userId, path.id)
      return {
        code: 200,
        body: toResponseRegisteredCourse(course),
      }
    },
    delete: async (req) => {
      await deleteRegisteredCourse(req.userId, [req.path.id])
      return {
        code: 204,
      }
    },
  },
}

export default handler
