import { truncate } from "help-my-strings"
import React from "react"
import { FlatList } from "react-native"

import { api } from "../api"
import { Button } from "../Components/Button"
import { Card } from "../Components/Card"
import { FullScreenLoading } from "../Components/FullScreenLoading"
import { Screen } from "../Components/Screen"
import { SlideShow } from "../Components/SlideShow"
import { Spacer } from "../Components/Spacer"
import { Text } from "../Components/Text"
import { routes } from "../routes"

export class WikiPlantScreen extends React.Component {
  state = { plant: null }
  get id() {
    return this.props.match.params.id
  }
  async componentDidMount() {
    const plant = await api.wikiShowPlant(this.id)
    console.log(plant)
    this.setState({ plant })
  }
  render() {
    const { history } = this.props
    const { plant } = this.state
    return (
      <Screen title={plant ? plant.name : ""} backTo style={{ padding: 16 }}>
        {!plant && <FullScreenLoading />}
        {plant && (
          <>
            <SlideShow images={plant.images || []} />

            <Text.H1>About</Text.H1>
            <Card>
              <Text>{plant.body}</Text>
            </Card>
            <Spacer height="large" />
            <Text.H1>Diseases</Text.H1>
            <FlatList
              data={plant.diseases}
              keyExtractor={item => item.id}
              renderItem={({ item: disease }) => (
                <Card key={disease.id}>
                  <Text.H2>{disease.name}</Text.H2>
                  <Text>{truncate(disease.body, { length: 300 })}</Text>
                  <Spacer height={12} />
                  <Button
                    onPress={() => history.push(routes.wiki("disease", disease.id))}
                    text="Read More"
                  />
                  <Spacer height={24} />
                </Card>
              )}
              ItemSeparatorComponent={() => <Spacer height="small" />}
            />
          </>
        )}
      </Screen>
    )
  }
}
