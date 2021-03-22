import { donationService } from '../gateway/donationService'

export function createSubscriptionCheckoutSessionUseCase(
  planId: string,
  userId: string
) {
  return donationService.createSubscriptionCheckoutSession({ planId, userId })
}
