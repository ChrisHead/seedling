import path from "path"
require("dotenv").config({ path: path.resolve(process.cwd(), "../server", ".env") })

import { SQL } from "@cd2/es-qu-el"
require("@tensorflow/tfjs-node")
import * as tf from "@tensorflow/tfjs"

import chalk from "chalk"
import fs from "fs"
import pgPromise from "pg-promise"
import { promisify } from "util"

import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants"
import { createNetwork, compile } from "./network"
import { loadFileAndParse } from "./parseData"
import { db } from "../db"
import { ab2str, str2ab, flatten } from "../utils"

const TEST_DATA_PERC = 0.15
const VALIDATION_DATA_PERC = 0.15

const MAX_VALUE = 0.9
const MIN_VALUE = 0.1

const BATCH_SIZE = 32
const readDir = promisify(fs.readdir)

train("Apples")

interface ILabelledTensorObject {
  labels: tf.Tensor2D
  data: tf.Tensor4D
}

export async function train(plant: string) {
  const trainingRoot = path.join("trainingData/", plant)
  const folderNames = await readDir(trainingRoot)

  const network = await loadOrCreateNetwork(plant, folderNames.length)

  compile(network)

  const files: { filename: string; label: string }[] = []

  for (const folder of folderNames) {
    const fileNames = await fs.promises.readdir(path.join(trainingRoot, folder))
    const fullFileNames = fileNames.map(name => ({
      filename: path.join(trainingRoot, folder, name),
      label: folder
    }))
    files.push(...fullFileNames)
  }

  shuffleArrays(files)
  const splitFiles = splitArrays(files)

  const testingTensors = await convertLabeledDataToTensors(folderNames, splitFiles.training)
  const validationTensors = await convertLabeledDataToTensors(folderNames, splitFiles.validation)

  testModel(network, testingTensors, folderNames)

  const totalEpochs = 30
  let epoch = totalEpochs
  while (epoch--) {
    console.log("===================================")
    console.log(chalk.blue(`Epoch ${totalEpochs - epoch} / ${totalEpochs}`))
    let batchIdx = 0
    while (true) {
      const nextBatch = splitFiles.training.slice(
        BATCH_SIZE * batchIdx,
        BATCH_SIZE * (batchIdx + 1)
      )
      batchIdx++
      if (nextBatch.length === 0) {
        break
      }
      console.log(chalk.blueBright(`Starting batch ${batchIdx}`))
      console.time("loaded files and creating tensors")
      const tensors = await convertLabeledDataToTensors(folderNames, nextBatch, batchIdx + "")
      console.timeEnd("loaded files and creating tensors")

      console.time("training")
      await trainNetwork(network, validationTensors, tensors)
      console.timeEnd("training")
    }
  }

  console.log("testing batch")
  testModel(network, testingTensors, folderNames)

  // tf.dispose(tensorCache as any)
  // tf.dispose(testingTensors as any)

  saveNetwork(plant, network, folderNames)
}

function testModel(network: tf.Sequential, tensors: ILabelledTensorObject, labelNames: string[]) {
  console.log("RUNNING NETWORK")
  const temp: any = network.predict(tensors.data)
  console.log(chalk.greenBright(labelNames.join()))
  console.log("expected")
  tensors.labels.print()
  console.log("predicted")
  temp.print()
}

const tensorCache: Record<string, ILabelledTensorObject> = {}
async function convertLabeledDataToTensors(
  labelNames: string[],
  data: { label: string; filename: string }[],
  tensorCacheKey?: string
): Promise<ILabelledTensorObject> {
  if (tensorCacheKey && tensorCacheKey in tensorCache) {
    return tensorCache[tensorCacheKey]
  }

  const allImageData = [] as number[][]
  const allLabels = [] as number[][]

  const len = labelNames.length
  console.time("Loading files")
  const proms = []
  for (const { label, filename } of data) {
    const labelArr = Array(len).fill(MIN_VALUE)
    labelArr[labelNames.indexOf(label)] = MAX_VALUE
    // const labelArr = labelNames.indexOf(label) * 0.8 + 0.1

    const prom = loadFileAndParse(filename).then(imageData => {
      allImageData.push(imageData)
      allLabels.push(labelArr)
    })
    proms.push(prom)
  }

  await Promise.all(proms)
  console.timeEnd("Loading files")

  console.time("creating tensors")
  const labelTensors = tf.tensor2d(allLabels, [data.length, len])
  const dataTensors = tf.tensor4d(flatten(allImageData), [
    data.length,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    3
  ])
  console.timeEnd("creating tensors")
  const tensors = { data: dataTensors, labels: labelTensors }

  if (tensorCacheKey) {
    tensorCache[tensorCacheKey] = tensors
  }

  return tensors
}

function splitArrays<T>(array: T[]): { test: T[]; validation: T[]; training: T[] } {
  const len = array.length
  const testCnt = Math.floor(len * TEST_DATA_PERC)
  const validCnt = Math.floor(len * VALIDATION_DATA_PERC)

  const test = array.slice(0, testCnt)
  const validation = array.slice(testCnt, testCnt + validCnt)
  const training = array.slice(testCnt + validCnt)

  return { training, validation, test }
}

function shuffleArrays(...arrs: any[][]) {
  if (arrs.length === 0) {
    return
  }

  for (var i = arrs[0].length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    for (const arr of arrs) {
      var temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }
}

async function trainNetwork(
  model: tf.Sequential,
  validationData: ILabelledTensorObject,
  tensorsObject: ILabelledTensorObject
) {
  const { data, labels } = tensorsObject
  await model.fit(data, labels, {
    epochs: 1,
    verbose: 0,
    validationData: [validationData.data, validationData.labels],
    callbacks: {
      async onEpochEnd(num, logs) {
        console.log("plotLoss", logs.val_loss, "validation")
        console.log("plotAccuracy", logs.val_acc, "validation")
      }
    }
  })
}

export async function loadOrCreateNetwork(name: string, outputs: number) {
  try {
    return await loadNetwork(name)
  } catch (err) {
    console.error(err)
    console.log("failed to load network. Creating new")
    return createNetwork(outputs)
  }
}

export async function loadNetwork(name: string) {
  return tf.loadLayersModel(customIo(name)) as Promise<tf.Sequential>
}
export async function saveNetwork(plant: string, network: tf.Sequential, labels) {
  await network.save(customIo(plant, labels))
}

const customIo = (name: string, labels?: string[]) => ({
  async save(modelArtifacts) {
    console.log("SAVING")

    const body = {
      model: {
        modelTopology: modelArtifacts.modelTopology,
        format: modelArtifacts.format,
        generatedBy: modelArtifacts.generatedBy,
        convertedBy: modelArtifacts.convertedBy,
        weightSpecs: modelArtifacts.weightSpecs
      }
    } as any
    if (modelArtifacts.weightData != null) {
      body.weightData = ab2str(modelArtifacts.weightData)
    }

    await db.any(
      SQL`
        INSERT INTO "networks" ("name", "data", "labels")
        VALUES (${name}, ${as => as.json(body)}, ${labels.join(",")})
        ON CONFLICT ("name") DO UPDATE SET "data"=excluded."data"`
    )

    return {} as any
  },
  async load() {
    console.log("LOADING")
    const row = await db.oneOrNone(SQL`SELECT "data" FROM "networks" WHERE "name"=${name}`)
    if (!row) {
      throw new Error(`could not load network with name ${name}`)
    }
    console.log(typeof row.data)
    const body = row.data
    const modelArtifacts = {
      ...body.model,
      weightData: str2ab(body.weightData)
    }
    return modelArtifacts
  }
})
