import * as grpc from '@grpc/grpc-js'
import * as protobuf from 'protobufjs'
import * as protoLoader from '@grpc/proto-loader'
import { CourseService } from '../../generated/services/course'
import { TimetableService } from '../../generated/services/timetable'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import { SchoolCalendarService } from '../../generated/services/schoolCalendar'
import { DonationService } from '../../generated/services/donation'
import { All } from '../type/utils'

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

type GrpcClientCallMethod = (
  req: any,
  callback: grpc.requestCallback<any>
) => void

type ResponseTypeFromMethod<
  T extends GrpcClientCallMethod
> = Parameters<T> extends [any, grpc.requestCallback<infer Res>] ? Res : never

type RequestTypeFromMethod<
  T extends GrpcClientCallMethod
> = Parameters<T> extends [infer Req, grpc.requestCallback<any>] ? Req : never

type WrappedGrpcClient<T extends GrpcClient<protobuf.rpc.Service>> = {
  [K in FilteredKeys<T, GrpcClientCallMethod>]: (
    req: RequestTypeFromMethod<T[K]>
  ) => Promise<All<ResponseTypeFromMethod<T[K]>>>
}

export function createClient<T extends typeof protobuf.rpc.Service>(
  protos: string[],
  service: T,
  address: string
): GrpcClient<InstanceType<T>> {
  const def = protoLoader.loadSync(protos, { defaults: true })
  const Client = grpc.loadPackageDefinition(def)[
    service.name
  ] as ServiceClientConstructor
  const client = (new Client(
    address,
    grpc.ChannelCredentials.createInsecure()
  ) as unknown) as GrpcClient<InstanceType<T>>

  return client
}

function wrapGrpcRequestMethod<Method extends GrpcClientCallMethod>(
  method: Method
): (
  req: RequestTypeFromMethod<Method>
) => Promise<All<ResponseTypeFromMethod<Method>>> {
  return (req: RequestTypeFromMethod<Method>) =>
    new Promise<All<ResponseTypeFromMethod<Method>>>((resolve, reject) => {
      method(req, (err, res) => {
        if (err || !res) reject(err)
        else resolve(res)
      })
    })
}

export function wrapGrpcClient<Client extends GrpcClient<protobuf.rpc.Service>>(
  client: Client
): WrappedGrpcClient<Client> {
  const wrapped: { [key: string]: any } = {}
  // @ts-ignore
  Object.keys(client.__proto__).forEach((k) => {
    // @ts-ignore
    const fn = client[k]
    if (typeof fn === 'function') {
      wrapped[k] = wrapGrpcRequestMethod(
        fn.bind(client) as GrpcClientCallMethod
      )
    }
  })
  // @ts-ignore
  return wrapped
}
