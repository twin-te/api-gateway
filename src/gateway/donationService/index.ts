import { DonationService } from '../../../generated/services/donation'
import { createClient, wrapGrpcClient } from '../grpc'

export const donationService = wrapGrpcClient(
  createClient(
    ['services/donation-service/protos/DonationService.proto'],
    DonationService,
    'donation:50051'
  )
)
