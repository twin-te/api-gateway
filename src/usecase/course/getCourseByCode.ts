import { courseService } from '../../gateway/courseService'
import { Course } from '../../type/course'

type GetCoursesByCodeUseCaseProps = {
  year: number
  code: string
}[]

/**
 * 年度と科目番号から講義を取得
 * @param conditions 年度と科目番号のセット
 * @param suppressNotFoundError 一部の講義がなくてもエラーにしない
 */
export async function getCoursesByCodeUseCase(
  conditions: GetCoursesByCodeUseCaseProps,
  suppressNotFoundError: boolean = false
): Promise<Course[]> {
  return courseService.getCoursesByCode({ conditions, suppressNotFoundError })
}
