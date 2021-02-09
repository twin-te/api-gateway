import { Course } from '../type/course'

import { courseServiceClient } from '../grpc'
import { ICourse } from '../../generated/services/course'

type All<T> = {
  [P in keyof T]-?: All<NonNullable<T[P]>>
}

export const courseService = {
  getCoursesByCode: (conditions: { year: number; code: string }[]) =>
    new Promise<All<ICourse>[]>((resolve, reject) => {
      courseServiceClient.getCoursesByCode({ conditions }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.courses as All<ICourse>[])
      })
    }),
}
