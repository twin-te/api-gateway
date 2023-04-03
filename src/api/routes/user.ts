import { paths } from '../../../generated/openapi/schema'
import { deleteUserUseCase } from '../../usecase/user/deleteUser'
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
    delete: async ({ userId }) => {
      await deleteUserUseCase(userId)
      return {
        code: 204,
      }
    },
  },
}

export default handler
