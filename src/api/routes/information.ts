import { paths } from '../../../generated/openapi/schema'
import { getInformationUseCase } from '../../usecase/information/getInformation'
import { PartialServerImplementation } from '../typeMapper'

type InformationHandler = PartialServerImplementation<paths, '/information'>

const handler: InformationHandler = {
  '/information': {
    get: async ({ query }) => {
      const info = await getInformationUseCase(query.limit)
      return {
        code: 200,
        body: info,
      }
    },
  },
}

export default handler
