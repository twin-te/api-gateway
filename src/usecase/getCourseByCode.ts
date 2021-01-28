import { courseService } from '../gateway/courseService'
import { Course } from '../type/course'

type GetCoursesByCodeUseCaseProps = {
  year: number
  code: string
}[]

export async function getCoursesByCodeUseCase(
  props: GetCoursesByCodeUseCaseProps
): Promise<Course[]> {
  return courseService.getCoursesByCode(props)
}
