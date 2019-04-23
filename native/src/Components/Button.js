import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
export function Button({
  onPress,
  backgroundColor = "white",
  color = "black",
  icon,
  iconRight = false,
  text,
}) {
  const iconNode = (
    <Icon
      name={icon}
      style={{ flex: 1, color, textAlign: iconRight ? "right" : "left" }}
      size={24}
    />
  )
  const fillerNode = <View style={{ flex: 1 }} />
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        elevation: 2,
        backgroundColor,
        padding: 16,
        alignItems: "center",
        borderRadius: 8,
      }}
    >
      {iconRight ? fillerNode : iconNode}
      <View style={{ flex: 3 }}>
        <Text style={{ textAlign: "center", fontSize: 16, color }}>{text}</Text>
      </View>
      {iconRight ? iconNode : fillerNode}
    </TouchableOpacity>
  )
}
