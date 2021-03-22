import { paths } from '../../../generated/openapi/schema'
import {
  PaymentStatus,
  PaymentType,
  SubscriptionStatus,
} from '../../../generated/services/donation'
import { createOneTimeCheckoutSessionUseCase } from '../../usecase/createOneTimeCheckoutSession'
import { createSubscriptionCheckoutSessionUseCase } from '../../usecase/createSubscriptionCheckoutSession'
import { getPaymentUserUseCase } from '../../usecase/getPaymentUser'
import { getTotalAmountUseCase } from '../../usecase/getTotalAmount'
import { listContributorsUseCase } from '../../usecase/listContributors'
import { listPaymentHistory } from '../../usecase/listPaymentHistory'
import { listSubscriptionUseCase } from '../../usecase/listSubscription'
import { unsubscribeUseCase } from '../../usecase/unsubscribe'
import { updatePaymentUserUseCase } from '../../usecase/updatePaymentUser'
import { PartialServerImplementation } from '../typeMapper'

type DonationHandler = PartialServerImplementation<
  paths,
  | '/donation/payment'
  | '/donation/users/me'
  | '/donation/session/onetime'
  | '/donation/session/subscription'
  | '/donation/subscriptions'
  | '/donation/subscriptions/{id}'
  | '/donation/aggregate/totalAmount'
  | '/donation/aggregate/users'
>

const handler: DonationHandler = {
  '/donation/payment': {
    get: async ({ userId }) => {
      const payments = await listPaymentHistory(userId)
      return {
        code: 200,
        body: payments.map(({ status, type, ...p }) => ({
          ...p,
          status:
            status === PaymentStatus.Succeeded
              ? 'Succeeded'
              : status === PaymentStatus.Canceled
              ? 'Canceled'
              : 'Pending',
          type: type === PaymentType.OneTime ? 'OneTime' : 'Subscription',
        })),
      }
    },
  },
  '/donation/users/me': {
    get: async ({ userId }) => {
      const user = await getPaymentUserUseCase(userId)
      return {
        code: 200,
        body: {
          twinteUserId: user.userId,
          paymentUserId: user.id,
          displayName: user.displayName,
          link: user.link,
        },
      }
    },
    patch: async ({ body, userId }) => {
      const user = await updatePaymentUserUseCase(
        userId,
        body.displayName,
        body.link
      )
      return {
        code: 200,
        body: {
          twinteUserId: user.userId,
          paymentUserId: user.id,
          displayName: user.displayName,
          link: user.link,
        },
      }
    },
  },
  '/donation/session/onetime': {
    post: async ({ body, userId }) => {
      const session = await createOneTimeCheckoutSessionUseCase(
        body.amount,
        userId
      )
      return {
        code: 200,
        body: {
          sessionId: session.id,
        },
      }
    },
  },
  '/donation/session/subscription': {
    post: async ({ body, userId }) => {
      const session = await createSubscriptionCheckoutSessionUseCase(
        body.planId,
        userId
      )
      return {
        code: 200,
        body: {
          sessionId: session.id,
        },
      }
    },
  },
  '/donation/subscriptions': {
    get: async ({ userId }) => {
      const { subscriptions } = await listSubscriptionUseCase(userId)
      return {
        code: 200,
        body: subscriptions.map((s) => ({
          id: s.id,
          status:
            s.status === SubscriptionStatus.Active ? 'Active' : 'Canceled',
          plans: s.plans,
          created: s.created,
        })),
      }
    },
  },
  '/donation/subscriptions/{id}': {
    delete: async ({ path, userId }) => {
      await unsubscribeUseCase(userId, path.id)
      return {
        code: 200,
        body: {},
      }
    },
  },
  '/donation/aggregate/totalAmount': {
    get: async () => {
      const { total } = await getTotalAmountUseCase()
      return {
        code: 200,
        body: {
          total,
        },
      }
    },
  },
  '/donation/aggregate/users': {
    get: async () => {
      const { contributors } = await listContributorsUseCase()
      return {
        code: 200,
        body: contributors,
      }
    },
  },
}

export default handler
