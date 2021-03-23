import { Dayjs } from 'dayjs'
import {
  Day,
  EventType,
  IModuleTerm,
} from '../../../generated/services/schoolCalendar'
import { All } from '../../type/utils'
import { schoolCalendarServiceClient } from '../grpc'

export type SchoolCalendarEvent = {
  id: number
  date: string
  type: EventType
  description: string
  changeTo?: Day
}

export const schoolCalendarService = {
  getEvents: (year: number) =>
    new Promise<SchoolCalendarEvent[]>((resolve, reject) => {
      schoolCalendarServiceClient.getEvents({ year }, (err, res) => {
        if (err || !res) reject(err)
        else
          resolve(
            res.events.map(({ changeTo, ...e }) => ({
              ...e,
              changeTo:
                e.type === EventType.SubstituteDay ? changeTo : undefined,
            })) as SchoolCalendarEvent[]
          )
      })
    }),
  getEventsByDate: (date: Dayjs) =>
    new Promise<SchoolCalendarEvent[]>((resolve, reject) => {
      schoolCalendarServiceClient.getEventsByDate(
        { date: date.toISOString() },
        (err, res) => {
          if (err || !res) reject(err)
          else
            resolve(
              res.events.map(({ changeTo, ...e }) => ({
                ...e,
                changeTo:
                  e.type === EventType.SubstituteDay ? changeTo : undefined,
              })) as SchoolCalendarEvent[]
            )
        }
      )
    }),
  getModuleTerms: (year: number) =>
    new Promise<All<IModuleTerm>[]>((resolve, reject) => {
      schoolCalendarServiceClient.getModuleTerms({ year }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.terms as All<IModuleTerm>[])
      })
    }),
  getModuleTermByDate: (date: Dayjs) =>
    new Promise<All<IModuleTerm>>((resolve, reject) => {
      schoolCalendarServiceClient.getModuleTermByDate(
        { date: date.toISOString() },
        (err, res) => {
          if (err || !res) reject(err)
          else resolve(res as All<IModuleTerm>)
        }
      )
    }),
}
