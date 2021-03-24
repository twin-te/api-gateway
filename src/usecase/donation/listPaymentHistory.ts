import { donationService } from '../../gateway/donationService'

export async function listPaymentHistory(userId: string) {
  return (await donationService.listPaymentHistory({ userId })).payments
}
