import { donationService } from '../../gateway/donationService'

export async function getPaymentUserUseCase(userId: string) {
  return donationService.getPaymentUser({ userId })
}
