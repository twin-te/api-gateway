import { informationService } from '../../gateway/informationService'

export function getInformationUseCase(limit: number) {
  return informationService.getInformation(limit)
}
