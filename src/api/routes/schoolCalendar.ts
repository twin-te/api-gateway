import { get } from 'http'
import { components, paths } from '../../../generated/openapi/schema'
import { IEvent, IModuleTerm } from '../../../generated/services/schoolCalendar'
import { All } from '../../type/utils'
import { getEventsUseCase } from '../../usecase/getEvents'
import { getModuleTermsUseCase } from '../../usecase/getModuleTerms'
import { PartialServerImplementation } from '../typeMapper'

type SchoolCalendarHandler = PartialServerImplementation<
  paths,
  '/school-calendar/events' | '/school-calendar/modules'
>

const handler: SchoolCalendarHandler = {
  '/school-calendar/events': {
    async get({ query }) {
      return {
        code: 200,
        body: (await getEventsUseCase(query.year)).map(toResponseEvent),
      }
    },
  },
  '/school-calendar/modules': {
    async get({ query }) {
      return {
        code: 200,
        body: (await getModuleTermsUseCase(query.year)).map(
          toResponseModuleTerm
        ),
      }
    },
  },
}

export default handler

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const EVENT_TYPE = [
  'Holiday',
  'PublicHoliday',
  'Exam',
  'SubstituteDay',
  'Other',
] as const

export function toResponseEvent(
  e: All<IEvent>
): components['schemas']['SchoolCalendarEvent'] {
  return {
    date: e.date,
    description: e.description,
    eventType: EVENT_TYPE[e.type],
    changeTo: DAYS[e.changeTo],
  }
}

const MODULE = [
  'SpringA',
  'SpringB',
  'SpringC',
  'FallA',
  'FallB',
  'FallC',
  'SummerVacation',
  'SpringVacation',
] as const

export function toResponseModuleTerm(
  m: All<IModuleTerm>
): components['schemas']['SchoolCalendarModule'] {
  return {
    ...m,
    module: MODULE[m.module],
  }
}
