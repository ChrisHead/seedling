import fs from "fs"
import { promisify } from "util"
import path from "path"
import { createNetwork } from "./network"
import jpegJs from "jpeg-js"
import { IMAGE_WIDTH, IMAGE_HEIGHT } from "./constants"

const readFile = promisify(fs.readFile)

const cache = new Map()

export async function loadFileAndParse(fullPath: string) {
  if (!cache.has(fullPath)) {
    const jpeg = await readJpeg(fullPath)
    cache.set(fullPath, jpeg)
  }
  return cache.get(fullPath)!
}

async function readJpeg(filePath: string) {
  const img = await readFile(filePath)
  const rawData = jpegJs.decode(img, true)

  const size = Array.from(rawData.data).length

  const removedAlpha: number[] = []
  for (let i = 0; i < size; i++) {
    if (i % 4 === 3) {
      continue
    }
    removedAlpha.push(rawData.data[i] / 255)
  }

  const buckets = {} as any
  removedAlpha.forEach(al => {
    if (!buckets[al]) {
      buckets[al] = 0
    }
    buckets[al]++
  })

  return removedAlpha
}
