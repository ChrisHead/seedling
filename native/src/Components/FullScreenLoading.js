import React from "react"
import { View, ActivityIndicator } from "react-native"

export function FullScreenLoading() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={64} />
    </View>
  )
}
