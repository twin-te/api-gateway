import { Express } from 'express'
import {
  AlreadyExistError,
  InvalidArgumentError,
  NotFoundError,
} from '../error'
import { api as logger } from '../logger'

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
  METHOD extends keyof DEF[PATH],
  BODY_TYPE extends string = 'application/json'
> = DEF[PATH][METHOD] extends {
  parameters?: infer PARAMS
  requestBody?: { content: { [K in BODY_TYPE]: infer BODY } }
}
  ? PARAMS & { body: BODY; userId: string }
  : { userId: string }

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
        [K in keyof DEF[PATH][METHOD]['responses']]: DEF[PATH][METHOD]['responses'][K] extends never
          ? {
              code: K
            }
          : DEF[PATH][METHOD]['responses'][K] extends {
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
        async (req, res, next) => {
          try {
            // @ts-ignore
            const result = await impl[path][method]({
              body: req.body,
              query: req.query,
              header: req.headers,
              path: req.params,
              cookie: req.cookies,
              userId: req.userId,
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
          } catch (e) {
            next(toHttpError(e))
          }
        }
      )
    })
  })
  logger.debug('-------------------------------')
}

/**
 * HTTPで返すエラーに変換
 * @param e 変換
 * @returns expressで返すエラー
 */
function toHttpError(
  e: Error
): { message: string; errors: Error[]; status: Number } {
  if (e instanceof NotFoundError)
    return {
      message: e.message,
      errors: [e],
      status: 404,
    }
  else if (e instanceof AlreadyExistError)
    return {
      message: e.message,
      errors: [e],
      status: 400,
    }
  else if (e instanceof InvalidArgumentError)
    return {
      message: e.message,
      errors: [e],
      status: 400,
    }
  else
    return {
      message: e.message,
      errors: [e],
      status: 500,
    }
}
