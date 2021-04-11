import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'
import { InformationService } from '../../../generated/services/information'

const informationServiceClient = createClient(
  ['services/information-service/protos/InformationService.proto'],
  InformationService,
  process.env.INFORMATION_SERVICE_URL ?? 'information:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(informationServiceClient)

export const informationService = {
  getInformation: methodWrapper(informationServiceClient.getInformation, {
    from: (res) => res.Informations,
  }),
  setReadFlag: methodWrapper(informationServiceClient.setReadFlag),
}
