import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { middleware } from 'express-openapi-validator'
import { api as logger } from '../logger'
import { applyRouter } from './routes'

export function startServer() {
  return new Promise<void>((resolve, reject) => {
    const app = express()

    app.use(cookieParser())
    app.use(express.json())
    app.use(express.text())
    app.use(express.urlencoded({ extended: true }))

    app.use((req, res, next) => {
      if (logger.isTraceEnabled())
        logger.trace(req.method, req.originalUrl, req.body)
      else logger.info(req.method, req.originalUrl)
      next()
    })

    app.use(
      middleware({
        apiSpec: path.resolve(__dirname, '../../openapi-spec/spec.yml'),
        validateRequests: true,
        validateResponses: false,
      })
    )

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
        errors: err.errors,
      })
    })

    app.listen(3000, () => {
      logger.info('api server started.')
      resolve()
    })
  })
}
