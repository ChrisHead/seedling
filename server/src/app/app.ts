import { SQL } from "@cd2/es-qu-el"
import cors from "cors"
import { config } from "dotenv"
import express, { Handler } from "express"

import morgan from "morgan"
import helmet from "helmet"

config()

import { db } from "../db"
import { fileProviders } from "../fileProviders"
import { controller } from "./controller"
import { processRequestBody } from "./middleware"

const app = express()
app.use(helmet())
app.use(cors())
app.use(processRequestBody)
app.use(morgan("dev"))

const use = (method: string, path: string, cb: Handler) => app[method](path, handleErrors(cb))

use("get", "/photo/:id", async (req, res) => {
  const { id } = req.params
  const row = await db.one(SQL`SELECT * FROM "photos" WHERE id=${id}`)
  const handler = fileProviders[row.provider]
  const stream = handler.retrieve(row.data)
  stream.pipe(res)
})

use("post", "*", async (req, res) => {
  const name = req.path.replace(/^\//, "")

  const action = controller[name]
  if (!action) {
    const err = new Error(`Unknown action: ${name}`)
    ;(err as any).code = 404
    throw err
  }

  try {
    const data = await action(req.body)
    res.send({ data })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(err.code)
  }
  res.send({ error: err.message })
})

function handleErrors(cb: express.Handler): express.Handler {
  return async (req, res, next) => {
    try {
      await Promise.resolve(cb(req, res, next))
    } catch (err) {
      next(err)
    }
  }
}

export { app }
