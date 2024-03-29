import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { createTagsUseCase } from '../../usecase/timetable/tag/createTags'
import { getTagsUseCase } from '../../usecase/timetable/tag/getTags'
import { updateTagsUseCase } from '../../usecase/timetable/tag/updateTags'
import { deleteTagsUseCase } from '../../usecase/timetable/tag/deleteTags'

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
    patch: async ({ userId, body }) => {
      const tags = body.map((t) => ({ ...t, userId }))
      return {
        code: 200,
        body: await (
          await updateTagsUseCase(tags)
        ).map(({ name, userId, ...t }) => ({ ...t })),
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
          await updateTagsUseCase([
            { id: path.id, userId, name: body.name, position: -1 },
          ])
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
