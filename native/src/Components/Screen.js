// @ts-check
import React, { useContext } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { RouterContext } from "../RouterContext"
import { Menu, MenuTrigger, MenuOptions } from "react-native-popup-menu"
import ActionButton from "react-native-action-button"
import { Spacer } from "./Spacer"

function Screen({
  title,
  children,
  backTo = "",
  rightIcon = "dots-vertical",
  renderRight,
  onRightPress,
  fab,
  style,
}) {
  const router = useContext(RouterContext)
  function handleBackPress() {
    if (typeof backTo === "boolean") {
      router.history.goBack()
    } else {
      router.history.push(backTo)
    }
  }

  const rightNode = renderRight ? (
    <Menu>
      <MenuTrigger>
        <Icon name={rightIcon} size={24} />
      </MenuTrigger>

      <MenuOptions
        customStyles={{ optionsContainer: { marginTop: 42 } }}
        renderOptionsContainer={renderRight}
      />
    </Menu>
  ) : onRightPress ? (
    <TouchableOpacity onPress={onRightPress}>
      <Icon name={rightIcon} size={24} />
    </TouchableOpacity>
  ) : null

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackPress} style={[styles.topBarChild]}>
          {Boolean(backTo) && <Icon name="chevron-left" size={24} color="#000" />}
        </TouchableOpacity>
        <Text style={[styles.topBarChild, styles.topBarTitle]}>{title}</Text>
        <View style={[styles.topBarChild, styles.topBarRight]}>{rightNode}</View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[{ flexGrow: 1 }, style]}>
        {children}
        {fab && <Spacer height={104} />}
        {/* Spacer added to add blank space so fab doesnt overlap final content */}
      </ScrollView>

      {fab && (
        <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}>
          <ActionButton onPress={fab.onPress}>
            {fab.actions &&
              fab.actions.map(action => (
                <ActionButton.Item
                  key={action.key}
                  buttonColor={action.color}
                  title={action.title}
                  onPress={action.onPress}
                >
                  <Icon name={action.icon} color="white" style={{ fontSize: 20, height: 22 }} />
                </ActionButton.Item>
              ))}
          </ActionButton>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    height: 48,
    padding: 8,
    elevation: 1,
  },
  topBarChild: {
    flex: 1,
  },
  topBarTitle: {
    flex: 3,
    textAlign: "center",
  },
  topBarRight: {
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
  },
})

export { Screen }
