import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { middleware } from 'express-openapi-validator'
import { logger, expressLogger } from './logger'
import { applyRouter } from './routes'

logger.info('service is starting.')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  if (expressLogger.isTraceEnabled())
    expressLogger.trace(req.method, req.originalUrl, req.body)
  else expressLogger.info(req.method, req.originalUrl)
  next()
})

app.use(
  middleware({
    apiSpec: path.resolve(__dirname, '../openapi-spec/spec.yml'),
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
  expressLogger.error(req.method, req.originalUrl, req.body, err)
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  })
})

app.listen(3000, () => logger.info('ready.'))
