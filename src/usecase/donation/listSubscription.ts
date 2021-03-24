import { donationService } from '../../gateway/donationService'

export function listSubscriptionUseCase(userId: string) {
  return donationService.listSubscription({ userId })
}
