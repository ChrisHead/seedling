// @ts-check
import React, { useContext, useEffect, useState } from "react"
import { Text, View, Image } from "react-native"

import { Screen } from "../Components/Screen"
import { api } from "../api"
import { FullScreenLoading } from "../Components/FullScreenLoading"
import { loadPhotoIds, removePhotoId } from "../storage"
import { showNotification } from "../Notification"

export function PhotoShowScreen({ match, history }) {
  const [details, setDetails] = useState(null)
  const id = match.params.id

  useEffect(() => {
    api
      .photoShow(id)
      .then(setDetails)
      .catch(async () => {
        await removePhotoId(id)
        history.goBack()
      })
  }, [id])

  async function handleDestroy() {
    await api.photoDestroy(id)
    await removePhotoId(id)
    history.goBack()
    showNotification("Photo Removed")
  }

  return (
    <Screen
      title="Photo show"
      backTo
      rightIcon="trash-can"
      onRightPress={handleDestroy}
      style={{ padding: 8 }}
    >
      <Image source={{ uri: api.photoUrl(id), width: 200, height: 200 }} />

      {!details && <FullScreenLoading />}
      {details && (
        <>
          <Text>Plant: {details.plant.name}</Text>
          <Text>Public: {JSON.stringify(details.isPublic)}</Text>
          <Text>Status: {details.status}</Text>
          <Text>Results: {JSON.stringify(details.results)}</Text>
          <Text>
            Lat: {details.latitude}, Lng: {details.longitude}
          </Text>
        </>
      )}
    </Screen>
  )
}
