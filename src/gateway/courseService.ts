import { Course } from '../type/course'
import {
  Course as grpcCourse,
  GetCoursesByCodeRequest,
  GetCoursesByCodeRequestCondition,
} from '../../generated/services/course-service/protos/CourseService_pb'

import { courseServiceClient } from '../grpc'

export const courseService = {
  getCoursesByCode: (conditions: { year: number; code: string }[]) =>
    new Promise<Course[]>((resolve, reject) => {
      const req = new GetCoursesByCodeRequest()
      req.setConditionsList(
        conditions.map((c) => {
          const cc = new GetCoursesByCodeRequestCondition()
          cc.setYear(c.year)
          cc.setCode(c.code)
          return cc
        })
      )
      courseServiceClient.getCoursesByCode(req, (err, res) => {
        if (err || !res) {
          reject(err)
          return
        }
        resolve(res.getCoursesList().map(convertCourse))
      })
    }),
}

function convertCourse(c: grpcCourse): Course {
  const {
    hasparseerror,
    recomendedgradesList,
    methodsList,
    schedulesList,
    ...obj
  } = c.toObject()
  return {
    ...obj,
    recommendedGrades: recomendedgradesList,
    method: methodsList,
    schedules: schedulesList,
  }
}
