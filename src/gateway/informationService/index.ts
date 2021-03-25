import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'
import { InformationService } from '../../../generated/services/information'

const informationServiceClient = createClient(
  ['services/information-service/protos/InformationService.proto'],
  InformationService,
  'information:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(informationServiceClient)

export const informationService = {
  getInformation: methodWrapper(informationServiceClient.getInformation, {
    to: (limit: number) => ({ limit }),
    from: (res) => res.Informations,
  }),
}
