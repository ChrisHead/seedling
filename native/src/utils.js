import React, { useEffect, useRef, useState } from "react"
import ImagePicker from "react-native-image-picker"

export function getImage() {
  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(
      {
        title: "Select Photo",
        maxWidth: 1000,
        maxHeight: 1000,

        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      },
      response => {
        if (response.didCancel) {
          console.log("User cancelled image picker")
          reject("cancelled")
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error)
          reject(response.error)
        } else {
          resolve(response)
        }
      }
    )
  })
}

/**
 * @returns {Promise<Position>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    )
  })
}
