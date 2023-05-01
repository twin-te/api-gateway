import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'
import { UserService } from '../../../generated/services/user'

const userServiceClient = createClient(
  ['services/user-service/server/pb/UserService.proto'],
  UserService,
  process.env.USER_SERVICE_URL ?? 'user:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(userServiceClient)

export const userService = {
  deleteUser: methodWrapper(userServiceClient.deleteUser),
}
