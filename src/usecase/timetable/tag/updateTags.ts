import { timetableService } from '../../../gateway/timetableService'

type Input = {
  id: string
  userId: string
  name: string
}

export function updateTagsUseCase(tags: Input[]) {
  return timetableService.updateTags(tags)
}
