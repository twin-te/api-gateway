import { paths } from '../../../generated/openapi/schema'
import { getInformationUseCase } from '../../usecase/information/getInformation'
import { setReadFlagUseCase } from '../../usecase/information/setReadFlag'
import { PartialServerImplementation } from '../typeMapper'

type InformationHandler = PartialServerImplementation<
  paths,
  '/information' | '/information/{id}'
>

const handler: InformationHandler = {
  '/information': {
    get: async ({ query, userId }) => {
      const info = await getInformationUseCase(
        query.limit,
        query.offset,
        userId
      )
      return {
        code: 200,
        body: info,
      }
    },
  },
  '/information/{id}': {
    put: async ({ path, body, userId }) => {
      await setReadFlagUseCase(path.id, userId, body.read)
      return {
        code: 200,
        body: {},
      }
    },
  },
}

export default handler
