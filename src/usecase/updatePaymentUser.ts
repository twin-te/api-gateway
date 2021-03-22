import { donationService } from '../gateway/donationService'

export function updatePaymentUserUseCase(
  userId: string,
  displayName: string | undefined,
  link: string | undefined
) {
  return donationService.updatePaymentUser({ userId, displayName, link })
}
