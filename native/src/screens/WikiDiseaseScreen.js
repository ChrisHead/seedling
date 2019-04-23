import React from "react"
import { View } from "react-native"

import { api } from "../api"
import { Card } from "../Components/Card"
import { FullScreenLoading } from "../Components/FullScreenLoading"
import { Screen } from "../Components/Screen"
import { SlideShow } from "../Components/SlideShow"
import { Text } from "../Components/Text"

export class WikiDiseaseScreen extends React.Component {
  state = {
    disease: null,
  }
  get id() {
    return this.props.match.params.id
  }
  async componentDidMount() {
    const disease = await api.wikiShowDisease(this.id)
    this.setState({ disease })
  }
  render() {
    const { disease } = this.state

    return (
      <Screen title={disease ? disease.name : ""} backTo>
        {!disease && <FullScreenLoading />}
        {disease && (
          <>
            <SlideShow images={disease.images || []} />

            <View style={{ paddingHorizontal: 12 }}>
              <Text.H1>{disease.name}</Text.H1>
            </View>
            <Card>
              <Text.H2>About</Text.H2>
              <Text>{disease.body}</Text>
            </Card>
            <Card>
              <Text.H2>Treatments</Text.H2>
              <Text>{disease.treatment}</Text>
            </Card>
          </>
        )}
      </Screen>
    )
  }
}
