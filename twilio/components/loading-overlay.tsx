import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import colors from '../common/Colors'

export const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
