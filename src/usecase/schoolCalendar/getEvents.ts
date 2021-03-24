import { schoolCalendarService } from '../../gateway/schoolCalendarService'

export function getEventsUseCase(year: number) {
  return schoolCalendarService.getEvents({ year })
}
