import path from "path"
import Jimp from "jimp"

require("dotenv").config({ path: path.resolve(process.cwd(), "../server", ".env") })

import { update, SQL, IUpdateDefinition } from "@cd2/es-qu-el"
import { db } from "./db"
import { loadNetwork } from "./train"

const POLLING_TIME = 5000

run()
async function run() {
  await processImages()
  // setTimeout(() => {
  //   run()
  // }, POLLING_TIME)
}

async function processImages() {
  console.log("Checking for images")
  const pendingPhotos = await getPendingPhotos()
  if (pendingPhotos.length === 0) {
    console.log("No pending images.")
  } else {
    console.log(`Processing ${pendingPhotos.length} Images`)

    const photo = pendingPhotos[0]
    await updatePhoto(photo, { status: "processing" })
    const results = await runThroughNetwork(photo)
    await new Promise(resolve => setTimeout(resolve, 2000))
    await updatePhoto(photo, { status: "done", results })
    console.log("RESULTS", results)
    console.log(`Done.`)
  }
}

interface IPhoto {
  id: string
  provider: string
  data: string
  plant: {
    id: string
    name: string
  }
  status: "pending" | "processing" | "done"
  results: any
}

function getPendingPhotos() {
  return db.any<IPhoto>(`
    SELECT
      *,
      (
        SELECT row_to_json("plants")
        FROM "plants"
        WHERE "plants"."id"="photos"."plantId"
      ) as "plant"
    FROM "photos"
    WHERE status='pending'
  `)
}

async function updatePhoto(photo: IPhoto, changes: Partial<IPhoto>) {
  const set: IUpdateDefinition["set"] = {}
  if ("status" in changes) {
    set.status = changes.status
  }
  if ("results" in changes) {
    set.results = { [SQL.Json]: changes.results }
  }

  const sql = update({
    table: "photos",
    set,
    where: { id: photo.id },
  })
  await db.any(sql)
}

async function runThroughNetwork(photo: IPhoto) {
  const forward = await loadNetwork(photo.plant.name)

  const image = loadImageForPhoto(photo)
  const processedImage = await processImage(image)

  const results = await forward(processedImage)
  return results
}

function loadImageForPhoto(photo: IPhoto) {}

// ///////////////////////?
// /////////// IMAGE STUFF
// ///////////////////////?

// interface IProcessedImage {
//   data: number[]
// }

// async function processImage(imageRecord: IImage): Promise<IProcessedImage> {
//   const url = Image.getUrl(imageRecord)
//   const file = await downloadImage(url)
//   return file
// }

// async function downloadImage(url: string) {
//   return Jimp.read(url).then(image => {
//     // Do stuff with the image.
//     image = image.scaleToFit(256, 256)
//     const { width, height } = image.bitmap
//     const normalized = removeAlphaAndNormalize(image.bitmap)
//     return { width, height, data: normalized }
//   })
// }
// function removeAlphaAndNormalize(image: { width: number; height: number; data: Buffer }) {
//   const size = Array.from(image.data).length
//   const normalized: number[] = []
//   for (let i = 0; i < size; i++) {
//     if (i % 4 === 3) {
//       continue
//     }
//     const val = image.data[i] / 255
//     normalized.push(val)
//   }
//   return normalized
// }

// ////////////////////////
// ///////////Network stuff
// ////////////////////////

// interface IResult {
//   diseased: boolean
//   diseases: {
//     diseaseId: string
//     confidence: number
//   }[]
// }

// type IForwardFunction = (image: IProcessedImage) => IResult

// import { forward as forwardTemp } from "./network"
// import * as tf from "@tensorflow/tfjs"

// async function loadNetworkForPlant(plant: IPlant): Promise<IForwardFunction> {
//   // const network = loadNetworkFromFile(`./networkData/${plant.id}`)
//   function forward(image: IProcessedImage): IResult {
//     const tensor = tf.tensor4d(image.data, [1, 256, 256, 3])

//     const results = forwardTemp(tensor)
//     console.log(results)
//     return {
//       diseased: false,
//       diseases: [],
//     }
//   }

//   return forward
// }

// // function loadNetworkFromFile(file) {}
