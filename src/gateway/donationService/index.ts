import { DonationService } from '../../../generated/services/donation'
import { createClient, wrapGrpcClient } from '../grpc'

const donationServiceClient = createClient(
  ['services/donation-service/protos/DonationService.proto'],
  DonationService,
  process.env.DONATION_SERVICE_URL ?? 'donation:50051'
)

export const donationService = wrapGrpcClient(donationServiceClient)
