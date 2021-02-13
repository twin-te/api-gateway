import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { v4 } from 'uuid'
import { getCoursesByCodeUseCase } from '../../usecase/getCourseByCode'
import { Course } from '../../type/course'
import { toResponseMethod, toResponseSchedule } from '../converter'

type CourseHandler = PartialServerImplementation<
  paths,
  '/courses/{year}/{code}'
> &
  PartialServerImplementation<paths, '/courses/search'>

const handlers: CourseHandler = {
  '/courses/{year}/{code}': {
    get: async (req) => {
      try {
        const res = toResponseCourse(
          (
            await getCoursesByCodeUseCase([
              { year: req.path.year, code: req.path.code },
            ])
          )[0]
        )
        return {
          code: 200,
          body: res,
        }
      } catch (e) {
        return {
          code: 404,
          body: { message: 'not found', errors: [] },
        }
      }
    },
  },
  '/courses/search': {
    post: (req) => ({
      code: 200,
      body: [
        {
          id: v4(),
          name: 'test',
          code: 'CODE',
          year: 2020,
          instructor: 'inst',
          credit: 1.5,
          overview: 'overview',
          remarks: 'remarks',
          recommendedGrades: [1, 2],
          methods: ['Asynchronous'],
          schedules: [
            { module: 'SpringA', day: 'Mon', period: 1, room: 'room' },
          ],
        },
      ],
    }),
  },
}

export default handlers

function toResponseCourse({
  schedules,
  methods: method,
  ...obj
}: Course): components['schemas']['Course'] {
  return {
    ...obj,
    methods: method.map(toResponseMethod),
    schedules: schedules.map(toResponseSchedule),
  }
}
