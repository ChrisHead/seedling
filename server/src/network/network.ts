import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-node"
import { ab2str, str2ab } from "./utils"
import { db } from "../db"
import { SQL } from "@cd2/es-qu-el"
import { Stream } from "stream"
import Jimp from "jimp"
import streamToBuffer from "stream-to-buffer"
import { networkDebug } from "../debugs"

interface INetwork {
  model: IModel
  process(photo: Stream): Promise<IResults>
}
interface IModel extends tf.Sequential {
  labels: string[]
}
interface IResults {
  status: "healthy" | "diseased"
  healthyConfidence: number
  diseases: { name: string; confidence: number }[]
}

export async function saveNetwork(plant: string, network: IModel) {
  const structureAndParams = await network.save(customerSaver())

  await db.any(
    SQL`
      INSERT INTO "networks" ("name", "data", "labels")
      VALUES (${plant}, ${as => as.json(structureAndParams)}, ${network.labels.join(",")})
      ON CONFLICT ("name") DO UPDATE SET "data"=excluded."data"`
  )
}

export async function loadNetwork(name: string): Promise<INetwork> {
  const row = await db.oneOrNone(SQL`SELECT "data", "labels" FROM "networks" WHERE "name"=${name}`)
  if (!row) {
    throw new Error(`could not load network with name ${name}`)
  }

  const model = (await tf.loadLayersModel(customLoader(row))) as IModel
  model.labels = row.labels.split(",")

  return {
    model,
    async process(photo) {
      const image = await preProcessImage(photo)
      networkDebug("processed image")
      const tensor = tf.tensor4d(image.data, [1, 256, 256, 3])
      networkDebug("tensor made")
      const resultTensor = model.predict(tensor) as tf.Tensor
      const resultsRaw = Array.from(resultTensor.dataSync())
      networkDebug("raw results: %j", resultsRaw)

      const results = processResults(resultsRaw, model.labels)
      networkDebug("results: %j", results)

      return results
    },
  }
}

async function preProcessImage(file: Stream) {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    streamToBuffer(file, function(err, buffer) {
      if (err) {
        reject(err)
      } else {
        resolve(buffer)
      }
    })
  })

  return Jimp.read(buffer).then(async image => {
    image = image.cover(256, 256, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    const width = image.getWidth()
    const height = image.getHeight()

    const pixels = []
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixel = image.getPixelColor(x, y)
        const { r, g, b } = Jimp.intToRGBA(pixel)
        pixels.push(r / 255, g / 255, b / 255)
      }
    }
    return { width, height, data: pixels }
  })
}

function processResults(results: number[], labels: string[]): IResults {
  const diseases = results
    .map((result, i) => {
      return labels[i] === "healthy" ? null : { name: labels[i], confidence: result }
    })
    .filter(Boolean)
  const healthyConfidence = results[labels.indexOf("healthy")]
  const status = healthyConfidence > 0.5 ? "healthy" : "diseased"

  return { status, healthyConfidence, diseases }
}

function customerSaver() {
  return {
    async save(modelArtifacts) {
      const body = {
        model: {
          modelTopology: modelArtifacts.modelTopology,
          format: modelArtifacts.format,
          generatedBy: modelArtifacts.generatedBy,
          convertedBy: modelArtifacts.convertedBy,
          weightSpecs: modelArtifacts.weightSpecs,
        },
      } as any
      if (modelArtifacts.weightData != null) {
        body.weightData = ab2str(modelArtifacts.weightData)
      }

      return body
    },
  }
}

function customLoader(row) {
  return {
    async load() {
      const body = row.data
      const modelArtifacts = {
        ...body.model,
        weightData: str2ab(body.weightData),
      }
      return modelArtifacts
    },
  }
}
