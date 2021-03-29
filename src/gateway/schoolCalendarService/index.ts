import { Dayjs } from 'dayjs'
import {
  Day,
  EventType,
  SchoolCalendarService,
} from '../../../generated/services/schoolCalendar'
import { createClient, wrapGrpcRequestMethodFactory } from '../grpc'

export type SchoolCalendarEvent = {
  id: number
  date: string
  type: EventType
  description: string
  changeTo?: Day
}

const schoolCalendarServiceClient = createClient(
  ['services/school-calendar-service/protos/SchoolCalendarService.proto'],
  SchoolCalendarService,
  process.env.SCHOOL_CALENDAR_SERVICE_URL ?? 'school-calendar:50051'
)

const methodWrapper = wrapGrpcRequestMethodFactory(schoolCalendarServiceClient)

export const schoolCalendarService = {
  getEvents: methodWrapper(schoolCalendarServiceClient.getEvents, {
    from: (res) =>
      res.events.map(({ changeTo, ...e }) => ({
        ...e,
        changeTo: e.type === EventType.SubstituteDay ? changeTo : undefined,
      })),
  }),
  getEventsByDate: methodWrapper(schoolCalendarServiceClient.getEventsByDate, {
    to: (req: Dayjs) => ({ date: req.toISOString() }),
    from: (res) =>
      res.events.map(({ changeTo, ...e }) => ({
        ...e,
        changeTo: e.type === EventType.SubstituteDay ? changeTo : undefined,
      })),
  }),
  getModuleTerms: methodWrapper(schoolCalendarServiceClient.getModuleTerms, {
    from: (res) => res.terms,
  }),
  getModuleTermByDate: methodWrapper(
    schoolCalendarServiceClient.getModuleTermByDate,
    { to: (req: Dayjs) => ({ date: req.toISOString() }) }
  ),
}
