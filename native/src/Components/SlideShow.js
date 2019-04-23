import React from "react"
import { ScrollView, Image } from "react-native"

export function SlideShow({ images }) {
  if (images.length === 0) return null
  return (
    <ScrollView horizontal>
      {images.map(url => (
        <Image key={url} source={{ uri: url }} style={{ width: 300, height: 300 }} />
      ))}
    </ScrollView>
  )
}
