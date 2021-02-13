import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { createRegisteredCourse } from '../../usecase/createRegisteredCourse'
import { toResponseMethod, toResponseSchedule } from '../converter'
import { Course, CourseMethod, CourseSchedule } from '../../type/course'
import { nullToUndefined } from '../../type/utils'
import { getRegisteredCourses } from '../../usecase/getRegisteredCourse'

type TimetableHandler = PartialServerImplementation<
  paths,
  '/registered-courses' // | '/registered-courses/{id}' | '/tags' | '/tags/{id}'
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
      else
        return {
          code: 400,
          body: {
            message: 'no!!',
            errors: [],
          },
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
    memo: '',
    attendance: 0,
    absence: 0,
    late: 0,
    ...nullToUndefined(c),
  }
}
