import { timetableService } from '../../../gateway/timetableService'

export function getTagsUseCase(userId: string) {
  return timetableService.getTags(userId)
}
