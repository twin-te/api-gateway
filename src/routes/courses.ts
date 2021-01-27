import { ApiEndpointHandler, PartialServerImplementation } from '../typeMapper'
import { paths } from '../../generated/openapi/schema'
import { v4 } from 'uuid'

type CourseHandler = PartialServerImplementation<
  paths,
  '/courses/{year}/{code}'
> &
  PartialServerImplementation<paths, '/courses/search'>

const handlers: CourseHandler = {
  '/courses/{year}/{code}': {
    get: (req) => ({
      code: 200,
      body: {
        id: v4(),
        name: 'test',
        code: req.path.code,
        year: req.path.year,
        instructor: 'inst',
        credit: 1.5,
        overview: 'overview',
        remarks: 'remarks',
        recommendedGrades: [1, 2],
        methods: ['Asynchronous'],
        schedules: [{ module: 'SpringA', day: 'Mon', period: 1, room: 'room' }],
      },
      header: {},
    }),
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
