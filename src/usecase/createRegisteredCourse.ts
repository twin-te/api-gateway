import { courseService } from '../gateway/courseService'
import { timetableService } from '../gateway/timetableService'
import { CourseMethod, CourseSchedule } from '../type/course'
import { RegisteredCourse } from '../type/regissteredCourse'

/**
 * ベースがある講義を作成
 * @param userId ユーザーID
 * @param courses 作成する講義
 */
export async function createRegisteredCourse(
  userId: string,
  courses: { year: number; code: string }[]
): Promise<RegisteredCourse[]> {
  const baseCourses = await courseService.getCoursesByCode(courses)
  const res = await timetableService.createRegisteredCourses(
    baseCourses.map((b) => ({ userId, courseId: b.id, year: b.year, tags: [] }))
  )
  return res.map(({ courseId, ...c }) => ({
    course: baseCourses.find((b) => b.id === courseId)!,
    ...c,
  }))
}

export async function createCustomRegisteredCourse(
  userId: string,
  courses: {
    userId: string
    year: number | null
    name: string | null
    instructor: string | null
    credit: number | null
    methods: CourseMethod[] | null
    schedules: CourseSchedule[] | null
    tags: string[]
  }
) {}
