import { informationService } from '../../gateway/informationService'

export async function setReadFlagUseCase(
  id: string,
  userId: string,
  read: boolean
) {
  await informationService.setReadFlag({ id, userId, read })
}
