import { CourseMethod } from '../../generated/services/timetable'
import { courseService } from '../gateway/courseService'
import { timetableService } from '../gateway/timetableService'
import { CourseSchedule } from '../type/course'

type Input = {
  id: string
  courseId?: string
  year: number
  name?: string
  instructor?: string
  credit?: number
  methods?: CourseMethod[]
  schedules?: CourseSchedule[]
  tags: { id: string }[]
  memo: string
  attendance: number
  absence: number
  late: number
}

export async function updateRegisteredCourse(userId: string, input: Input[]) {
  const courses = await timetableService.updateRegisteredCourses(
    input.map((i) => ({ userId, ...i }))
  )
  const baseCourses = await courseService.getCourses(
    courses.map((c) => c.courseId).filter((c) => c) as string[]
  )
  return courses.map(({ courseId, ...c }) => ({
    course: baseCourses.find((b) => b.id === courseId) ?? null,
    ...c,
  }))
}
