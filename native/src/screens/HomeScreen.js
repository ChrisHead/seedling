// @ts-check
import React, { useContext } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

import { Screen } from "../Components/Screen"
import { Spacer } from "../Components/Spacer"
import { Text } from "../Components/Text"
import { RouterContext } from "../RouterContext"
import { routes } from "../routes"

const styles = StyleSheet.create({
  square: {
    elevation: 2,
    margin: 16,
    flex: 1,
    alignItems: "center",

    backgroundColor: "white",
    padding: 24,
  },
  row: {
    flexDirection: "row",
  },
})

export function HomeScreen() {
  return (
    <Screen title="Seedling">
      <HomePanel icon="leaf" name="Album" body="your pictures" to={routes.photos()} />
      <HomePanel icon="university" name="Encyclopedia" body="This is a wiki" to={routes.wiki()} />
      <HomePanel icon="map" name="Map" body="see local outbreaks" to={routes.map()} />
    </Screen>
  )
}

function HomePanel({ name, to, icon, body }) {
  const router = useContext(RouterContext)

  return (
    <TouchableOpacity style={styles.square} onPress={() => router.history.push(to)}>
      <Icon size={32} name={icon} />
      <Spacer height={8} />
      <Text.H2>{name}</Text.H2>
      <Text.P>{body}</Text.P>
    </TouchableOpacity>
  )
}
