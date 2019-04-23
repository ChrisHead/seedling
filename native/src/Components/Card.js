import React from "react"
import { View, StyleSheet } from "react-native"
export function Card({ children }) {
  return <View style={styles.card}>{children}</View>
}

export const styles = StyleSheet.create({
  card: {
    elevation: 2,
    padding: 16,
    backgroundColor: "white",
    margin: 4,
    borderRadius: 8,
  },
  cardButton: {
    alignSelf: "flex-end",
  },
})
