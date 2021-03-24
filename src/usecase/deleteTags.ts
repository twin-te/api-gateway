import { timetableService } from '../gateway/timetableService'

export function deleteTagsUseCase(userId: string, ids: string[]) {
  return timetableService.deleteTags({ userId, ids })
}
