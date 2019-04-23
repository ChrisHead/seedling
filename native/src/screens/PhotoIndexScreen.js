// @ts-check
import React, { useContext, useEffect, useState } from "react"

import { Screen } from "../Components/Screen"
import { Text } from "../Components/Text"
import { routes } from "../routes"
import { loadPhotoIds, removePhotoId } from "../storage"
import { api } from "../api"
import { Image, TouchableOpacity, FlatList } from "react-native"
import { View } from "react-native"
export function PhotoIndexScreen({ history }) {
  const [photoIds, setPhotoIds] = useState([])

  useEffect(loadPhotos, [])

  function loadPhotos() {
    loadPhotoIds().then(setPhotoIds)
  }

  async function handleImageError(id) {
    await removePhotoId(id)
    loadPhotos()
  }

  return (
    <Screen
      backTo
      title="Your Photos"
      fab={{
        onPress: () => {
          history.push(routes.photosCreate())
        },
      }}
    >
      {photoIds.length === 0 && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#aaa" }}>No Photos</Text>
        </View>
      )}
      <FlatList
        data={photoIds}
        keyExtractor={id => id}
        numColumns={2}
        renderItem={({ item: id }) => (
          <TouchableOpacity key={id} onPress={() => history.push(routes.photosShow(id))}>
            <Image
              source={{ uri: api.photoUrl(id), width: 200, height: 200 }}
              onError={() => handleImageError(id)}
            />
          </TouchableOpacity>
        )}
      />
    </Screen>
  )
}
