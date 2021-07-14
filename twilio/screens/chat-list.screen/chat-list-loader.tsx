import React from 'react'
import { StyleSheet } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { View } from '../../components/Themed'

export const ChatListLoader = () => {
  return (
    <SkeletonPlaceholder speed={1000}>
      <View style={styles.container}>
        {new Array(10).fill(null).map((_, index) => (
          <View style={styles.item} key={index} />
        ))}
      </View>
    </SkeletonPlaceholder>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  item: {
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
})
