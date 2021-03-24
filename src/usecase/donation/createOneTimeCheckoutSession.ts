import { donationService } from '../../gateway/donationService'

export function createOneTimeCheckoutSessionUseCase(
  amount: number,
  userId?: string
) {
  return donationService.createOneTimeCheckoutSession({ amount, userId })
}
