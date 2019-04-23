import React from "react"
import { StyleSheet, View } from "react-native"

export function Hr() {
  return <View style={styles.hr} />
}

const styles = StyleSheet.create({
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
