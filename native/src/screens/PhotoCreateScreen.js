import React, { useEffect, useRef, useState } from "react"
import { Image, Picker, CheckBox, View } from "react-native"
import ImagePicker from "react-native-image-picker"

import { api } from "../api"
import { Button } from "../Components/Button"
import { Screen } from "../Components/Screen"
import { Spacer } from "../Components/Spacer"
import { Text } from "../Components/Text"

import { AsyncStorage } from "react-native"
import { appendPhotoId } from "../storage"
import { showNotification } from "../Notification"
import { getImage, getCurrentLocation } from "../utils"
import { routes } from "../routes"

export function PhotoCreateScreen({ match, history }) {
  const [photo, setPhoto] = React.useState(null)
  const [plants, setPlants] = React.useState(null)
  const [plantId, setPlantId] = React.useState(null)
  const [isPublic, setIsPublic] = React.useState(true)

  React.useEffect(() => {
    api.plantList().then(setPlants)
  }, [])

  async function handleTakePicture() {
    const photo = await getImage()
    console.log(photo)
    setPhoto(photo)
  }

  let savingRef = useRef()

  async function handleSubmitPicture() {
    if (savingRef.current) {
      console.warn("already saving")
      return
    }

    if (!plantId) {
      showNotification("No plant selected")
    } else if (!photo) {
      showNotification("No photo selected")
    } else {
      savingRef.current = true
      let { type, data, latitude, longitude } = photo
      if (!latitude || !longitude) {
        const tmp = await getCurrentLocation()
        latitude = tmp.coords.latitude
        longitude = tmp.coords.longitude
      }

      const dataUrl = `data:${type};base64,${data}`
      const photoRow = await api.photoCreate({
        plantId,
        photo: dataUrl,
        isPublic,
        latitude,
        longitude,
      })
      await appendPhotoId(photoRow.id)
      showNotification("Photo Uploaded")
      history.replace(routes.photosShow(photoRow.id))
    }
  }

  return (
    <Screen backTo style={{ padding: 8 }} title="Upload Photo">
      <Spacer height="medium" />
      {plants && (
        <Picker selectedValue={plantId} onValueChange={val => setPlantId(val)}>
          <Picker.Item label="Select Plant" />
          {plants.map(plant => (
            <Picker.Item key={plant.id} value={plant.id} label={plant.name} />
          ))}
        </Picker>
      )}
      <Spacer height="medium" />
      <Button onPress={handleTakePicture} text="Select Photo" />
      {photo && <Image source={{ uri: photo.uri, width: 300, height: 300 }} />}
      <Spacer height="large" />
      {/* <Text>Make Photo Public</Text>
      <CheckBox value={isPublic} onValueChange={val => setIsPublic(val)} /> */}
      <Button onPress={handleSubmitPicture} text="Submit" />
    </Screen>
  )
}
