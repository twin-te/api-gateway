import { credentials } from '@grpc/grpc-js'
import { CourseServiceClient } from '../generated/services/course-service/protos/CourseService_grpc_pb'
import { GetCoursesRequest } from '../generated/services/course-service/protos/CourseService_pb'

const client = new CourseServiceClient(
  'course:50051',
  credentials.createInsecure()
)

const req = new GetCoursesRequest()
req.setIdsList(['c3cec298-6bc9-48fa-a8a1-96b720480ae5'])
client.getCourses(req, (_, res) => {
  console.log(res?.getCoursesList())
})
