// @ts-check
import React from "react"
import { MenuProvider } from "react-native-popup-menu"
import { NativeRouter, Redirect, Route, Switch } from "react-router-native"

import { SyncBackButtonWithRouter } from "./src/Components/SyncBackButtonWithRouter"
import { RouterContext } from "./src/RouterContext"
import { routes } from "./src/routes"

import { HomeScreen } from "./src/screens/HomeScreen"
import { WikiIndexScreen } from "./src/screens/WikiIndexScreen"
import { WikiPlantScreen } from "./src/screens/WikiPlantScreen"
import { WikiDiseaseScreen } from "./src/screens/WikiDiseaseScreen"
import { MapScreen } from "./src/screens/MapScreen"
import { PhotoIndexScreen } from "./src/screens/PhotoIndexScreen"
import { PhotoCreateScreen } from "./src/screens/PhotoCreateScreen"
import { PhotoShowScreen } from "./src/screens/PhotoShowScreen"
import { ErrorBoundry } from "./src/Components/ErrorBoundry"

export default function App() {
  return (
    <MenuProvider>
      <NativeRouter>
        <Route
          render={route => (
            <RouterContext.Provider value={route}>
              <ErrorBoundry>
                <SyncBackButtonWithRouter history={route.history} />
                <Switch>
                  <Route exact path={routes.home()} component={HomeScreen} />
                  <Route path={routes.wiki("plant")} component={WikiPlantScreen} />
                  <Route path={routes.wiki("disease")} component={WikiDiseaseScreen} />
                  <Route path={routes.wiki()} component={WikiIndexScreen} />
                  <Route path={routes.map()} component={MapScreen} />
                  <Route exact path={routes.photos()} component={PhotoIndexScreen} />
                  <Route exact path={routes.photosCreate()} component={PhotoCreateScreen} />
                  <Route exact path={routes.photosShow()} component={PhotoShowScreen} />
                  <Route
                    render={route => {
                      console.warn("404", route)
                      return <Redirect to="/" />
                    }}
                  />
                </Switch>
              </ErrorBoundry>
            </RouterContext.Provider>
          )}
        />
      </NativeRouter>
    </MenuProvider>
  )
}
