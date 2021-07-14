import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { showMessage } from 'react-native-flash-message'

import colors from '../common/Colors'
import { TwilioService } from '../services/twilio.service'
import { LoadingOverlay } from '../components/loading-overlay'
import { useUser } from '../contexts/user.context'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'
import { RouteProp } from '@react-navigation/native'

type NavigationProps = StackNavigationProp<RootStackParamList,
  'MessagesScreen'>

type RouteProps = RouteProp<RootStackParamList, 'MessagesScreen'>

type Props = {
  navigation: NavigationProps
  route: RouteProps
}

export const MessagesScreen: FC<Props> = ({ route }) => {
  const { channelId } = route.params
  const { username } = useUser()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const chatClientChannel = useRef<any>()
  const chatMessagesPaginator = useRef<any>()

  const setChannelEvents = useCallback((channel) => {
    chatClientChannel.current = channel
    chatClientChannel?.current?.on('messageAdded', (message) => {
      const newMessage = TwilioService.getInstance().parseMessage(message)
      const { giftedId } = message.attributes
      if (giftedId) {
        setMessages((prevMessages) => {
          if (prevMessages.some(({ _id }) => _id === giftedId)) {
            return prevMessages.map((m) => (m._id === giftedId ? newMessage : m))
          }
          return [newMessage, ...prevMessages]
        })
      }
    })
    return chatClientChannel.current
  }, [])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const client = await TwilioService.getInstance().getChatClient()
        const channel = await client.getChannelBySid(channelId)
        const currentChannel = setChannelEvents(channel)
        const paginator = await currentChannel.getMessages()

        chatMessagesPaginator.current = paginator
        const newMessages = TwilioService.getInstance().parseMessages(paginator.items)
        setMessages(newMessages)
      } catch (e) {
        showMessage({ message: e.message, type: 'danger' })
      } finally {
        setLoading(false)
      }
    }

    getMessages()

    // TwilioService.getInstance()
    //   .getChatClient()
    //   .then((client) => client.getChannelBySid(channelId))
    //   .then((channel) => setChannelEvents(channel))
    //   .then((currentChannel) => currentChannel.getMessages())
    //   .then((paginator) => {
    //     chatMessagesPaginator.current = paginator;
    //     const newMessages = TwilioService.getInstance().parseMessages(paginator.items);
    //     setMessages(newMessages);
    //   })
    //   .catch((err) => showMessage({ message: err.message, type: 'danger' }))
    //   .finally(() => setLoading(false));
  }, [channelId, setChannelEvents])

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id }
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))
    chatClientChannel.current?.sendMessage(newMessages[0].text, attributes)
  }, [])

  return (
    <View style={styles.screen}>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <GiftedChat
          messagesContainerStyle={styles.messageContainer}
          messages={messages}
          renderAvatarOnTop
          onSend={(messages) => onSend(messages)}
          user={{ _id: username }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  messageContainer: {
    backgroundColor: colors.snow,
  },
})
