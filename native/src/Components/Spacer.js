import React from "react"
import { View } from "react-native"

/**
 *
 * @param {{width?: number | "small" | "medium" | "large", height?:  number | "small" | "medium" | "large"}} props
 */
export function Spacer({ width, height }) {
  const sizes = {
    small: 8,
    medium: 16,
    large: 32,
  }
  const widthNum = sizes[width] || width
  const heightNum = sizes[height] || height

  return <View style={{ width: widthNum, height: heightNum }} />
}
