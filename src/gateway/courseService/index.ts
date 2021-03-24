import { All } from '../../type/utils'
import {
  CourseService,
  ICourse,
  ISearchCourseRequest,
} from '../../../generated/services/course'
import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'

const courseServiceClient = createClient(
  ['services/course-service/protos/CourseService.proto'],
  CourseService,
  'course:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(courseServiceClient)

export const courseService = {
  getCoursesByCode: methodWrapper(courseServiceClient.getCoursesByCode, {
    from: (res) => res.courses,
  }),
  getCourses: methodWrapper(courseServiceClient.getCourses, {
    to: (ids: string[]) => ({ ids }),
    from: (res) => res.courses,
  }),
  searchCourses: methodWrapper(courseServiceClient.searchCourse, {
    from: (res) => res.courses,
  }),
}
