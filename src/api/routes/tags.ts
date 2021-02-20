import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { createTagsUseCase } from '../../usecase/createTags'
import { getTagsUseCase } from '../../usecase/getTags'
import { updateTagsUseCase } from '../../usecase/updateTags'
import { deleteTagsUseCase } from '../../usecase/deleteTags'

type RegisteredCourseHandler = PartialServerImplementation<
  paths,
  '/tags' | '/tags/{id}'
>

const handler: RegisteredCourseHandler = {
  '/tags': {
    post: async ({ userId, body }) => {
      return {
        code: 200,
        body: (await createTagsUseCase([{ userId, name: body.name }]))[0],
      }
    },
    get: async ({ userId }) => {
      return {
        code: 200,
        body: await getTagsUseCase(userId),
      }
    },
  },
  '/tags/{id}': {
    put: async ({ userId, body, path }) => {
      return {
        code: 200,
        body: (
          await updateTagsUseCase([{ id: path.id, userId, name: body.name }])
        )[0],
      }
    },
    delete: async ({ userId, path }) => {
      await deleteTagsUseCase(userId, [path.id])
      return {
        code: 204,
      }
    },
  },
}

export default handler
