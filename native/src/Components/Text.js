import React from "react"
import { Text as NativeText } from "react-native"

const Text = NativeText
Text.H1 = ({ children }) => {
  return <Text style={{ fontSize: 32, fontWeight: "600", marginVertical: 12 }}>{children}</Text>
}
Text.H2 = ({ children }) => {
  return (
    <Text
      style={{
        fontSize: 24,
        marginVertical: 12,
      }}
    >
      {children}
    </Text>
  )
}
Text.P = ({ children }) => {
  return (
    <Text
      style={{
        fontSize: 16,
        marginVertical: 8,
      }}
    >
      {children}
    </Text>
  )
}

export { Text }
