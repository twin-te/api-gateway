import { courseService } from '../gateway/courseService'
import { Day, Module } from '../type/course'

export enum SearchMode {
  Cover,
  Contain,
}

type Input = {
  year: number
  keywords: string[]
  searchMode: SearchMode
  timetable?: {
    [module in keyof typeof Module]?: {
      [day in keyof typeof Day]?: boolean[]
    }
  }
}

export function searchCourseUseCase(input: Input) {
  return courseService.searchCourses(input)
}
