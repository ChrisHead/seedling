// @ts-check
import { titleize } from "help-my-strings"
import React, { useEffect, useRef, useState } from "react"
import { CheckBox, StyleSheet, View, Image, TouchableOpacity } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { MenuOption } from "react-native-popup-menu"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { Screen } from "../Components/Screen"
import { api } from "../api"
import { Text } from "../Components/Text"

const markerPinComponents = {
  shop: ShopMarker,
  farm: FarmMarker,
  nursery: NurseryMarker,
  // photo: PhotoMarker,
}
const selectedMarkerComponents = {
  shop: ShopMapPopout,
  farm: ShopMapPopout,
  nursery: ShopMapPopout,
}

export function MapScreen() {
  const [currentMarkerId, setCurrentMarkerId] = React.useState(null)
  const [markers, setMarkers] = React.useState([])
  const markerTypes = Object.keys(markerPinComponents)
  const [visibility, setVisibility] = React.useState({})
  const mapRef = React.createRef()

  useEffect(() => {
    api.mapMarkers().then(setMarkers)
  }, [])

  function toggleMarkerView(type) {
    const newVisibiliy = { ...visibility }
    newVisibiliy[type] = newVisibiliy[type] === false ? true : false
    setVisibility(newVisibiliy)
  }

  const currentMarker = markers.find(marker => marker.id === currentMarkerId)

  let selectedNode = null
  if (currentMarker) {
    const PopoutComp = selectedMarkerComponents[currentMarker.type]
    if (!PopoutComp) {
      console.warn(`unknown marker type ${currentMarker.type}`)
    } else {
      selectedNode = <PopoutComp marker={currentMarker} />
    }
  }

  return (
    <Screen
      title="Map"
      backTo="/"
      renderRight={() =>
        markerTypes.map(type => (
          <MenuOption key={type} style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              value={visibility[type] !== false}
              onValueChange={() => toggleMarkerView(type)}
            />
            <Text>{titleize(type)}</Text>
          </MenuOption>
        ))
      }
      rightIcon="eye"
    >
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 52.75537570558129,
          latitudeDelta: 0.036545296705050134,
          longitude: -1.2149717845022678,
          longitudeDelta: 0.035636164247989655,
        }}
      >
        {markers
          .filter(marker => visibility[marker.type] !== false)
          .map(marker => {
            const MarkerComp = markerPinComponents[marker.type]
            if (!MarkerComp) {
              console.warn(`unknown marker type ${marker.type}`)
              return null
            }
            return (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                onPress={() => setCurrentMarkerId(marker.id)}
              >
                <MarkerComp {...marker} />
              </Marker>
            )
          })}
      </MapView>
      {selectedNode}
    </Screen>
  )
}

function FarmMarker() {
  return (
    <Pin>
      <Icon name="tractor" size={24} color="#fff" />
    </Pin>
  )
}
function ShopMarker() {
  return (
    <Pin>
      <Icon name="store" size={24} color="#fff" />
    </Pin>
  )
}
function NurseryMarker() {
  return (
    <Pin>
      <Icon name="leaf" size={24} color="#fff" />
    </Pin>
  )
}
function PhotoMarker({ data }) {
  return (
    <Pin>
      <Image source={{ width: 50, height: 50, uri: api.photoUrl(data.id) }} />
    </Pin>
  )
}

function Pin({ children }) {
  return <View style={styles.pin}>{children}</View>
}

// function MapPopout({ marker }) {
//   return (
//     <View style={styles.mapPopout}>
//       {/* <TouchableOpacity onPress={gotoPreviousMarker}>
//         <Icon size={32} name="chevron-left" />
//       </TouchableOpacity> */}
//       <View style={styles.mapPopoutContent}>
//         <Text>{JSON.stringify(marker)}</Text>
//       </View>
//       {/* <TouchableOpacity onPress={gotoNextMarker}>
//         <Icon size={32} name="chevron-right" />
//       </TouchableOpacity> */}
//     </View>
//   )
// }

function ShopMapPopout({ marker }) {
  return (
    <View style={styles.mapPopout}>
      {/* <TouchableOpacity onPress={gotoPreviousMarker}>
        <Icon size={32} name="chevron-left" />
      </TouchableOpacity> */}
      <View style={[styles.mapPopoutContent, styles.shopPopout]}>
        <Text.H2>{marker.data.name}</Text.H2>
        <Spacer width="medium" />
        <TouchableOpacity
          onPress={() => {
            openMap({ end: `${marker.latitude},${marker.longitude}` })
          }}
        >
          <Icon name="directions" size={32} />
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity onPress={gotoNextMarker}>
        <Icon size={32} name="chevron-right" />
      </TouchableOpacity> */}
    </View>
  )
}
import openMap from "react-native-open-maps"
import { Spacer } from "../Components/Spacer"

const styles = StyleSheet.create({
  pin: {
    backgroundColor: "red",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPopout: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  mapPopoutContent: {
    flex: 1,
  },
  shopPopout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
