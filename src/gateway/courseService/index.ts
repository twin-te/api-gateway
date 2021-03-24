import { All } from '../../type/utils'
import {
  CourseService,
  ICourse,
  ISearchCourseRequest,
} from '../../../generated/services/course'
import { createClient } from '../grpc'

const courseServiceClient = createClient(
  ['services/course-service/protos/CourseService.proto'],
  CourseService,
  'course:50051'
)

export const courseService = {
  getCoursesByCode: (conditions: { year: number; code: string }[]) =>
    new Promise<All<ICourse>[]>((resolve, reject) => {
      courseServiceClient.getCoursesByCode({ conditions }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.courses as All<ICourse>[])
      })
    }),
  getCourses: (ids: string[]) =>
    new Promise<All<ICourse>[]>((resolve, reject) => {
      courseServiceClient.getCourses({ ids }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.courses as All<ICourse>[])
      })
    }),
  searchCourses: (req: ISearchCourseRequest) =>
    new Promise<All<ICourse>[]>((resolve, reject) => {
      courseServiceClient.searchCourse(req, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.courses as All<ICourse>[])
      })
    }),
}
