import { credentials } from '@grpc/grpc-js'
import { CourseServiceClient } from '../generated/services/course-service/protos/CourseService_grpc_pb'

export const courseServiceClient = new CourseServiceClient(
  'course:50051',
  credentials.createInsecure()
)
