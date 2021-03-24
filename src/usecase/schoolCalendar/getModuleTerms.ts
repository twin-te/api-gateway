import { schoolCalendarService } from '../../gateway/schoolCalendarService'

export function getModuleTermsUseCase(year: number) {
  return schoolCalendarService.getModuleTerms({ year })
}
