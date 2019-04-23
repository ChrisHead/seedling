import { getPendingPhotos, updatePhoto, IPhoto, loadImageForPhoto } from "./photoModel"
import { loadNetwork } from "./network"
import { networkDebug } from "../debugs"

export async function processPhotos() {
  console.log("Checking for images")
  const pendingPhotos = await getPendingPhotos()
  if (pendingPhotos.length === 0) {
    console.log("No pending images.")
  } else {
    console.log(`Processing ${pendingPhotos.length} Images`)

    const photo = pendingPhotos[0]
    await updatePhoto(photo, { status: "processing" })

    const network = await loadNetwork(photo.plant.name)
    networkDebug("loaded network", network)

    const image = await loadImageForPhoto(photo.id)
    networkDebug("loaded image", image)

    const results = await network.process(image)
    await updatePhoto(photo, { status: "done", results })

    console.log(`Done.`)
  }
}
