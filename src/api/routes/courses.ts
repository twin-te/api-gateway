import { PartialServerImplementation } from '../typeMapper'
import { paths, components } from '../../../generated/openapi/schema'
import { getCoursesByCodeUseCase } from '../../usecase/getCourseByCode'
import { Course } from '../../type/course'
import { toResponseMethod, toResponseSchedule } from '../converter'
import { searchCourseUseCase, SearchMode } from '../../usecase/searchCourse'

type CourseHandler = PartialServerImplementation<
  paths,
  '/courses/{year}/{code}'
> &
  PartialServerImplementation<paths, '/courses/search'>

const handlers: CourseHandler = {
  '/courses/{year}/{code}': {
    get: async (req) => {
      try {
        const res = toResponseCourse(
          (
            await getCoursesByCodeUseCase([
              { year: req.path.year, code: req.path.code },
            ])
          )[0]
        )
        return {
          code: 200,
          body: res,
        }
      } catch (e) {
        return {
          code: 404,
          body: { message: 'not found', errors: [] },
        }
      }
    },
  },
  '/courses/search': {
    post: async ({ body }) => {
      const res = await searchCourseUseCase({
        year: body.year,
        keywords: body.keywords,
        searchMode:
          body.searchMode === 'Contain' ? SearchMode.Contain : SearchMode.Cover,
        timetable: body.timetable ? convertModules(body.timetable) : undefined,
      })
      return {
        code: 200,
        body: res.map(toResponseCourse),
      }
    },
  },
}

export default handlers

function toResponseCourse({
  schedules,
  methods: method,
  ...obj
}: Course): components['schemas']['Course'] {
  return {
    ...obj,
    methods: method.map(toResponseMethod),
    schedules: schedules.map(toResponseSchedule),
  }
}

function convertModules(
  modules: components['schemas']['SearchCourseTimetableQuery']
) {
  const res: {
    [day in keyof components['schemas']['SearchCourseTimetableQuery']]: {
      [day in keyof components['schemas']['SearchCourseTimetableQueryDays']]: boolean[]
    }
  } = {}
  Object.keys(modules).forEach((k) => {
    res[
      k as keyof components['schemas']['SearchCourseTimetableQuery']
    ] = convertDays(
      modules[k as keyof components['schemas']['SearchCourseTimetableQuery']]!
    )
  })
  return res
}

function convertDays(
  days: components['schemas']['SearchCourseTimetableQueryDays']
) {
  const res: {
    [day in keyof components['schemas']['SearchCourseTimetableQueryDays']]: boolean[]
  } = {}
  Object.keys(days).forEach((k) => {
    res[
      k as keyof components['schemas']['SearchCourseTimetableQueryDays']
    ] = convertPeriods(
      days[k as keyof components['schemas']['SearchCourseTimetableQueryDays']]!
    )
  })
  return res
}

function convertPeriods(
  periods: components['schemas']['SearchCourseTimetableQueryPeriods']
): boolean[] {
  return [
    periods[0] ?? false,
    periods[1] ?? false,
    periods[2] ?? false,
    periods[3] ?? false,
    periods[4] ?? false,
    periods[5] ?? false,
    periods[6] ?? false,
    periods[7] ?? false,
    periods[8] ?? false,
  ]
}
