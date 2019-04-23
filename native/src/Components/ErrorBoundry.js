import React from "react"
import { Text } from "./Text"
import { routes } from "../routes"
export class ErrorBoundry extends React.Component {
  state = { error: null }
  componentDidCatch(error) {
    console.error(error)
    this.setState({ error })
  }
  render() {
    const { error } = this.state
    if (error) {
      return (
        <Screen title="Error">
          <Text.H1>An error occurred</Text.H1>
          <Link
            to={routes.home()}
            onPress={() => {
              this.setState({ error: null })
            }}
          >
            <Text.P>Back to home.</Text.P>
          </Link>
        </Screen>
      )
    } else {
      return this.props.children
    }
  }
}
