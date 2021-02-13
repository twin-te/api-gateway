import { All } from '../../type/utils'

import { courseServiceClient } from '../grpc'
import { ICourse } from '../../../generated/services/course'

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
}
