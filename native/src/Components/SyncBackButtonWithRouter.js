import React from "react"
import { BackHandler } from "react-native"
export class SyncBackButtonWithRouter extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress)
  }
  handleBackPress = () => {
    const { history } = this.props
    if (history.index > 0) {
      history.goBack()
      return true
    } else {
      return false
    }
  }
  render() {
    return null
  }
}
