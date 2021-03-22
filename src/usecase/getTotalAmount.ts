import { donationService } from '../gateway/donationService'

export function getTotalAmountUseCase() {
  return donationService.getTotalAmount({})
}
