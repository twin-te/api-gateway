import { timetableService } from '../../../gateway/timetableService'

type Input = {
  id: string
  userId: string
  name?: string
  position?: number
}

export function updateTagsUseCase(tags: Input[]) {
  return timetableService.updateTags(tags)
}
