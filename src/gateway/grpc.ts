import * as grpc from '@grpc/grpc-js'
import * as protobuf from 'protobufjs'
import * as protoLoader from '@grpc/proto-loader'
import { CourseService } from '../../generated/services/course'
import { TimetableService } from '../../generated/services/timetable'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import { SchoolCalendarService } from '../../generated/services/schoolCalendar'
import { DonationService } from '../../generated/services/donation'

export type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<DeepRequired<T[K]>>
}

type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T]

type ProtobufFn = (request: {}) => PromiseLike<{}>
type RequestArgType<T extends ProtobufFn> = T extends (
  request: infer U
) => PromiseLike<any>
  ? U
  : never
type ResponseType<T extends ProtobufFn> = T extends (
  request: any
) => PromiseLike<infer U>
  ? U
  : never

export type GrpcClient<T extends protobuf.rpc.Service> = grpc.Client &
  {
    [K in FilteredKeys<T, ProtobufFn>]: (
      req: RequestArgType<T[K]>,
      callback: grpc.requestCallback<ResponseType<T[K]>>
    ) => void
  }

// function createClient<T extends typeof protobuf.rpc.Service>(
//   service: T,
//   address: string
// ): InstanceType<T> {
//   const Client = grpc.makeGenericClientConstructor({}, service.name, {})
//   const client = new Client(address, grpc.credentials.createInsecure())
//   const rpcImpl: protobuf.RPCImpl = function (method, requestData, callback) {
//     client.makeUnaryRequest(
//       method.name,
//       // @ts-ignore
//       (arg) => arg,
//       (arg) => arg,
//       requestData,
//       callback
//     )
//   }
//   return new service(rpcImpl) as InstanceType<T>
// }

// export const courseServiceClient = createClient(CourseService, 'course:50051')
// export const timetableServiceClient = createClient(
//   TimetableService,
//   'timetable:50051'
// )

function createClient<T extends typeof protobuf.rpc.Service>(
  protos: string[],
  service: T,
  address: string
): GrpcClient<InstanceType<T>> {
  const def = protoLoader.loadSync(protos, { defaults: true })
  const Client = grpc.loadPackageDefinition(def)[
    service.name
  ] as ServiceClientConstructor
  return (new Client(
    address,
    grpc.ChannelCredentials.createInsecure()
  ) as unknown) as GrpcClient<InstanceType<T>>
}

export const courseServiceClient = createClient(
  ['services/course-service/protos/CourseService.proto'],
  CourseService,
  'course:50051'
)

export const timetableServiceClient = createClient(
  ['Nullable.proto', 'Message.proto', 'TimetableService.proto'].map(
    (p) => `services/timetable-service/protos/${p}`
  ),
  TimetableService,
  'timetable:50051'
)

export const schoolCalendarServiceClient = createClient(
  ['services/school-calendar-service/protos/SchoolCalendarService.proto'],
  SchoolCalendarService,
  'school-calendar:50051'
)

export const donationServiceClient = createClient(
  ['services/donation-service/protos/DonationService.proto'],
  DonationService,
  'donation:50051'
)
