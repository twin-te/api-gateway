import { Express } from 'express'
import { logger } from './logger'

const HttpMethod = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
] as const
type HttpMethodType = typeof HttpMethod[number]

interface OpenApiDefinition {
  [key: string]: any
}

type AllowPromise<T> = T | Promise<T>

type ApiEndpointParam<
  DEF extends OpenApiDefinition,
  PATH extends keyof DEF,
  METHOD extends keyof DEF[PATH]
> = DEF[PATH][METHOD] extends {
  parameters: infer PARAMS
}
  ? PARAMS
  : {}

type ApiEndpointResponse<
  DEF extends OpenApiDefinition,
  PATH extends keyof DEF,
  METHOD extends keyof DEF[PATH],
  RESPONSE_TYPE extends string = 'application/json'
> = DEF[PATH][METHOD] extends {
  responses: {
    [key: number]: any
  }
}
  ? AllowPromise<
      {
        [K in keyof DEF[PATH][METHOD]['responses']]: DEF[PATH][METHOD]['responses'][K] extends {
          headers: infer HEADERS
        }
          ? {
              code: K
              body: DEF[PATH][METHOD]['responses'][K]['content'][RESPONSE_TYPE]
              header: HEADERS
            }
          : {
              code: K
              body: DEF[PATH][METHOD]['responses'][K]['content'][RESPONSE_TYPE]
            }
      }[keyof DEF[PATH][METHOD]['responses']]
    >
  : {}

export type ApiEndpointHandler<
  DEF extends OpenApiDefinition,
  PATH extends keyof DEF,
  METHOD extends keyof DEF[PATH],
  RESPONSE_TYPE extends string = 'application/json'
> = (
  req: ApiEndpointParam<DEF, PATH, METHOD>
) => ApiEndpointResponse<DEF, PATH, METHOD, RESPONSE_TYPE>

export type ServerImplementation<
  DEF extends OpenApiDefinition,
  RESPONSE_TYPE extends string = 'application/json'
> = {
  [PATH in keyof DEF]: {
    [METHOD in keyof DEF[PATH]]: ApiEndpointHandler<
      DEF,
      PATH,
      METHOD,
      RESPONSE_TYPE
    >
  }
}

export type PartialServerImplementation<
  DEF extends OpenApiDefinition,
  P extends keyof DEF,
  RESPONSE_TYPE extends string = 'application/json'
> = {
  [PATH in P]: {
    [METHOD in keyof DEF[PATH]]: ApiEndpointHandler<
      DEF,
      PATH,
      METHOD,
      RESPONSE_TYPE
    >
  }
}

export function mapToExpress<T extends OpenApiDefinition>(
  app: Express,
  impl: Partial<ServerImplementation<T>>
) {
  logger.debug('-----registered controller-----')
  Object.getOwnPropertyNames(impl).forEach((path) => {
    HttpMethod.filter((method) =>
      impl[path] ? impl[path]![method] : false
    ).forEach((method: HttpMethodType) => {
      logger.debug(`${method.toUpperCase()} ${path}`)
      app[method](
        path.replace(/{(.*?)}/g, (_, p) => `:${p}`),
        (req, res) => {
          // @ts-ignore
          const result = impl[path][method]({
            body: req.body,
            query: req.query,
            header: req.headers,
            path: req.params,
            cookie: req.cookies,
          })
          // @ts-ignore
          if (result.header)
            // @ts-ignore
            Object.keys(result.header).forEach((k) =>
              // @ts-ignore
              res.append(k, result.header[k])
            )
          // @ts-ignore
          res.status(result.code)
          // @ts-ignore
          res.json(result.body)
        }
      )
    })
  })
  logger.debug('-------------------------------')
}
