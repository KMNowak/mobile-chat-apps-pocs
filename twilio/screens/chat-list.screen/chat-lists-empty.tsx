import React from 'react'
import { StyleSheet, Text } from 'react-native'

import colors from '../../common/Colors'

export const ChatListEmpty = () => <Text style={styles.titleText}>No Chats Created</Text>


const styles = StyleSheet.create({
  titleText: {
    marginTop: '50%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.amaranth,
  },
})
