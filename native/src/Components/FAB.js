import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
export function FAB({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.fab]}>
      <Icon name={icon} size={24} color="#fff" />
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  fab: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#ff0000",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
})
