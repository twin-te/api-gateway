import { Dayjs } from 'dayjs'
import { IEvent, IModuleTerm } from '../../../generated/services/schoolCalendar'
import { All } from '../../type/utils'
import { schoolCalendarServiceClient } from '../grpc'

export const schoolCalendarService = {
  getEvents: (year: number) =>
    new Promise<All<IEvent>[]>((resolve, reject) => {
      schoolCalendarServiceClient.getEvents({ year }, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res.events as All<IEvent>[])
      })
    }),
  getEventsByDate: (date: Dayjs) =>
    new Promise<All<IEvent>[]>((resolve, reject) => {
      schoolCalendarServiceClient.getEventsByDate(
        { date: date.toISOString() },
        (err, res) => {
          if (err || !res) reject(err)
          else resolve(res.events as All<IEvent>[])
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
