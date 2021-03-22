import { donationService } from '../gateway/donationService'

export function listContributorsUseCase() {
  return donationService.listContributors({})
}
