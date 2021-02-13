import { courseService } from '../gateway/courseService'
import { Course } from '../type/course'

type GetCoursesByCodeUseCaseProps = {
  year: number
  code: string
}[]

/**
 * 年度と科目番号から講義を取得
 * @param props 年度と科目番号のセット
 */
export async function getCoursesByCodeUseCase(
  props: GetCoursesByCodeUseCaseProps
): Promise<Course[]> {
  return courseService.getCoursesByCode(props)
}
