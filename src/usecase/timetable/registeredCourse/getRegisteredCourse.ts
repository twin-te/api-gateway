import { courseService } from '../../../gateway/courseService'
import { timetableService } from '../../../gateway/timetableService'

export async function getRegisteredCourseUseCase(userId: string, id: string) {
  const course = await timetableService.getRegisteredCourse({ userId, id })
  if (course.courseId) {
    const baseCourse = await courseService.getCourses([course.courseId])
    return {
      ...course,
      course: baseCourse[0] ?? null,
    }
  } else {
    return {
      ...course,
      course: null,
    }
  }
}
