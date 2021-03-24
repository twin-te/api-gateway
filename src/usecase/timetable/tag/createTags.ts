import { timetableService } from '../../../gateway/timetableService'

type Input = {
  userId: string
  name: string
}

export function createTagsUseCase(tags: Input[]) {
  return timetableService.createTags(tags)
}
