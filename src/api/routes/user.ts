import { paths } from '../../../generated/openapi/schema'
import { PartialServerImplementation } from '../typeMapper'

type CourseHandler = PartialServerImplementation<paths, '/users/me'>

const handler: CourseHandler = {
  '/users/me': {
    get: ({ userId }) => {
      return {
        code: 200,
        body: {
          id: userId,
          name: '',
        },
      }
    },
  },
}

export default handler
