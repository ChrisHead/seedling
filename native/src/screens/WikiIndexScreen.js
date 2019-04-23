// @ts-check
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { Link, Switch } from "react-router-native"

import { Card } from "../Components/Card"
import { MyTextInput } from "../Components/MyTextInput"
import { Screen } from "../Components/Screen"
import { Spacer } from "../Components/Spacer"
import { Text } from "../Components/Text"
import { routes } from "../routes"
import { api } from "../api"
// import { api } from "../api"

export function WikiIndexScreen() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState(null)

  React.useEffect(() => {
    api.wikiSearch(query).then(setResults)
  }, [query])

  return (
    <Screen title="Wiki" backTo="/" style={{ padding: 8 }}>
      <Spacer height="medium" />
      <MyTextInput label="Plants, Diseases" value={query} onChangeText={setQuery} />
      <Spacer height="medium" />
      {!results && <FullScreenLoading />}
      {results && (
        <>
          <ResultsSection name="Plants" linkPrefix="plant" results={results.plants} />
          <ResultsSection name="Diseases" linkPrefix="disease" results={results.diseases} />
        </>
      )}
    </Screen>
  )
}

import { titleize } from "help-my-strings"
import { FullScreenLoading } from "../Components/FullScreenLoading"

function ResultsSection({ name, linkPrefix, results }) {
  if (!results || results.length === 0) {
    return null
  }
  return (
    <Card>
      <Text.H2>{titleize(name)}</Text.H2>
      {results.map(result => (
        <View key={result.id}>
          <Link to={routes.wiki(linkPrefix, result.id)}>
            <Text>{result.name}</Text>
          </Link>
        </View>
      ))}
    </Card>
  )
}
