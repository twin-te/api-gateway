import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'
import { SessionService } from '../../../generated/services/session'

const sessionServiceClient = createClient(
  ['services/session-service/protos/SessionService.proto'],
  SessionService,
  'session:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(sessionServiceClient)

export const sessionService = {
  getSession: methodWrapper(sessionServiceClient.getSession),
}
