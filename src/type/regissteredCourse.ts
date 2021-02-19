import { Course, CourseMethod, CourseSchedule } from './course'

export type RegisteredCourse = {
  id: string
  userId: string
  course: Course | null
  year: number
  name: string | null
  instructor: string | null
  credit: number | null
  methods: CourseMethod[] | null
  schedules: CourseSchedule[] | null
  tags: { id: string }[]
  memo: string
  attendance: number
  absence: number
  late: number
}
