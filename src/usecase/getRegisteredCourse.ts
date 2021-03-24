import { courseService } from '../gateway/courseService'
import { timetableService } from '../gateway/timetableService'
import { RegisteredCourse } from '../type/regissteredCourse'

/**
 * 登録済みの講義を取得する
 * @param userId ユーザーID
 * @param year 取得する年度
 */
export async function getRegisteredCourses(
  userId: string,
  year: number
): Promise<RegisteredCourse[]> {
  const registeredCourses = await timetableService.getRegisteredCourses({
    userId,
    year,
  })
  const baseCourses = await courseService.getCourses(
    registeredCourses.map((c) => c.courseId).filter((c): c is string => !!c)
  )

  return registeredCourses.map(({ courseId, ...c }) => ({
    course: baseCourses.find((b) => b.id === courseId) ?? null,
    ...c,
  }))
}
