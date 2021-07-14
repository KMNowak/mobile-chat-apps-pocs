import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { StateContextProvider } from './contexts/state.context'

console.disableYellowBox = true;

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <StateContextProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
          <FlashMessage position={'top'} hideStatusBar animated />
        </StateContextProvider>
      </SafeAreaProvider>
    )
  }
}
