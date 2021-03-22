import { donationService } from '../gateway/donationService'

export function unsubscribeUseCase(userId: string, id: string) {
  return donationService.unsubscribe({ userId, id })
}
