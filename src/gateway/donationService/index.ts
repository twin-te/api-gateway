import { DonationService } from '../../../generated/services/donation'
import { createClient, wrapGrpcClient } from '../grpc'

const donationServiceClient = createClient(
  ['services/donation-service/protos/DonationService.proto'],
  DonationService,
  'donation:50051'
)

export const donationService = wrapGrpcClient(donationServiceClient)
