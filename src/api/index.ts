import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { middleware } from 'express-openapi-validator'
import { api as logger } from '../logger'
import { applyRouter } from './routes'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import cors from 'cors'
import { getSession } from '../usecase/session/getSession'
import { toHttpError } from './typeMapper'
import { NotFoundError } from '../error'

const apiSpecPath = path.resolve(__dirname, '../../openapi-spec/spec.yml')

const sessionCookieName = process.env.COOKIE_NAME ?? 'twinte_session'
const isDev = process.env.NODE_ENV === 'development'

export function startApiServer() {
  return new Promise<void>((resolve, reject) => {
    const app = express()

    app.use(cookieParser())
    app.use(express.json())
    app.use(express.text())
    app.use(express.urlencoded({ extended: true }))

    app.use(
      cors({
        origin: isDev
          ? [
              /https:\/\/(.+\.)*twinte\.net$/,
              'https://twins.tsukuba.ac.jp',
              /localhost(:\d{1,5})?$/, // devの場合はlocalhost許可
            ]
          : [/https:\/\/(.+\.)*twinte\.net$/, 'https://twins.tsukuba.ac.jp'],
        credentials: true,
      })
    )

    app.use(
      '/api-docs',
      swaggerUI.serve,
      swaggerUI.setup(YAML.load(apiSpecPath))
    )

    app.use((req, res, next) => {
      if (logger.isTraceEnabled())
        logger.trace(req.method, req.originalUrl, req.body)
      else logger.info(req.method, req.originalUrl)
      next()
    })

    app.use(
      middleware({
        apiSpec: apiSpecPath,
        validateRequests: true,
        validateResponses: false,
      })
    )

    app.use(async (req, res, next) => {
      // TODO あとでいい方法を考える
      // 以下のurlは認証スキップ
      if (
        req.originalUrl.startsWith('/donation/aggregate/') ||
        req.originalUrl.startsWith('/donation/session/onetime') ||
        req.originalUrl.startsWith('/information')
      )
        next()

      try {
        req.userId = await getSession(req.cookies[sessionCookieName])
        if (!req.userId) {
          res.status(401)
          res.send({ message: 'Unauthorized', errors: [] })
        } else next()
      } catch (e) {
        if (e instanceof NotFoundError) {
          res.status(401)
          res.send({ message: 'Unauthorized', errors: [] })
        } else next(toHttpError(e))
      }
    })

    applyRouter(app)

    app.use((req, res) => {
      res.status(501)
      res.json({
        message: 'This method has not been implemented yet.',
        errors: [],
      })
    })

    app.use((err: any, req: any, res: any, next: any) => {
      logger.error(req.method, req.originalUrl, req.body, err)
      // format error
      res.status(err.status || 500).json({
        message: err.message,
        errors: isDev ? err.errors : [], // prodのときは詳細エラーは出さない
      })
    })

    app.listen(3000, () => {
      logger.info('api server started.')
      resolve()
    })
  })
}
