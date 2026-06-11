import express from "express"
import env from "./config/env.js"
import morgan from "morgan"
import errorMiddleware from "./middlewares/error.middleware.js"

export default function createApp() {
  const app = express()

  if (env.NODE_ENV == "development")
    app.use(morgan("dev"))


//Global Error Handling MiddlewareMiddlewares
  app.use(errorMiddleware)

  return app
}