import { informationService } from '../../gateway/informationService'

export function getInformationUseCase(
  limit: number,
  offset: number,
  userId?: string
) {
  return informationService.getInformation({
    limit,
    offset,
    user: userId ?? '',
  })
}
