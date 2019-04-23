import "@tensorflow/tfjs-node"

import * as tf from "@tensorflow/tfjs"
import { IMAGE_WIDTH, IMAGE_HEIGHT } from "./constants"

export function createNetwork(outputs: number) {
  const model = tf.sequential()
  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 3],
      kernelSize: 3,
      filters: 16,
      activation: "relu",
    })
  )
  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }))
  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: "relu" }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }))
  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: "relu" }))
  model.add(tf.layers.flatten({}))
  model.add(tf.layers.dense({ units: 64, activation: "relu" }))
  model.add(tf.layers.dense({ units: 2, activation: "softmax" }))

  return model
}

export function compile(network: tf.Sequential) {
  network.compile({
    optimizer: "rmsprop",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  })
}
