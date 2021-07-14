import React, { FC, useState } from 'react'
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { showMessage } from 'react-native-flash-message'

import { RootStackParamList } from '../navigation/types'
import { TwilioService } from '../services/twilio.service'
import { Text, View } from '../components/Themed'
import { LoadingOverlay } from '../components/loading-overlay'
import { images } from '../assets'
import colors from '../common/Colors'
import { useChannels } from '../contexts/channels.context'
import { useUser } from '../contexts/user.context'

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreateChatScreen'>
type RouteProps = RouteProp<RootStackParamList, 'CreateChatScreen'>
type Props = {
  navigation: NavigationProps
  route: RouteProps
}

export const CreateChatScreen: FC<Props> = ({ navigation }) => {
  const [channelName, setChannelName] = useState('')
  const [loading, setLoading] = useState(false)
  const { channels, setChannels } = useChannels()
  const { username } = useUser()

  const onAddChannel = (channel) => {
    const newChannel = TwilioService.getInstance().parseChannel(channel)
    setChannels(channels.concat(newChannel))
  }

  const onCreateOrJoin = async () => {
    try {
      const client = await TwilioService.getInstance().getChatClient()
      try {
        const channel = await client.getChannelByUniqueName(channelName)

        if (channel.channelState.status !== 'joined') {
          await channel.join()
          navigation.navigate({
            name: 'MessagesScreen',
            params: { channelId: channel.id },
          })
        }
      } catch
        (e) {
        const newChannel = await client.createChannel({
          uniqueName: channelName,
          friendlyName: channelName,
        })
        onAddChannel(newChannel)
        await newChannel.join()

        console.log('[DEBUG]: navigating')
        navigation.navigate({
          name: 'MessagesScreen',
          params: { channelId: newChannel.id },
        })
      }

      showMessage({ message: 'You have joined.' })
    } catch (e) {
      console.log('[DEBUG]: error')
      showMessage({ message: e.message, type: 'danger' })
    } finally {
      console.log('[DEBUG]: setting loading false')
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={images.message} />
      <TextInput
        value={channelName}
        onChangeText={setChannelName}
        style={styles.input}
        placeholder="Channel Name"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity style={styles.button} onPress={onCreateOrJoin}>
        <Text style={styles.buttonText}>Create Or Join</Text>
      </TouchableOpacity>
      {loading && <LoadingOverlay />}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.snow,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.amaranth,
  },
  input: {
    width: 280,
    height: 50,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.eclipse,
    marginTop: 32,
    marginBottom: 16,
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: colors.malibu,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: colors.white,
  },
})

