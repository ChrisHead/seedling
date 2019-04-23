//@ts-check
import React from "react"
import { TextInput } from "react-native"

export function MyTextInput({ value, label, onChangeText, reff = undefined, ...props }) {
  return (
    <TextInput
      ref={reff}
      style={{
        padding: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
      }}
      value={value}
      placeholder={label}
      onChangeText={onChangeText}
      {...props}
    />
  )
}
