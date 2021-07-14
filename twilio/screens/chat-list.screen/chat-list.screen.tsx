import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { showMessage } from 'react-native-flash-message'

import { RootStackParamList } from '../../navigation/types'
import { Text, View } from '../../components/Themed'
import colors from '../../common/Colors'
import { TwilioService } from '../../services/twilio.service'
import { getToken } from '../../services/token.service'
import { useChannels } from '../../contexts/channels.context'
import { ChatListLoader } from './chat-list-loader'
import { ChatListItem } from './chat-list-item'
import { ChatListEmpty } from './chat-lists-empty'
import { useUser } from '../../contexts/user.context'

type NavigationProps = StackNavigationProp<RootStackParamList,
  'ChatListScreen'>

type RouteProps = RouteProp<RootStackParamList, 'ChatListScreen'>

type Props = {
  navigation: NavigationProps
  route: RouteProps
}

export const ChatListScreen: FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const { channels, setChannels } = useChannels()
  const { username } = useUser()
  const channelPaginator = useRef<any>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.addButton}
          onPress={() => navigation.navigate('CreateChatScreen')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const setChannelEvents = useCallback(
    (client) => {
      client.on('messageAdded', (message) => {
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel.id === message.channel.sid ?
              { ...channel, lastMessageTime: message.dateCreated } : channel,
          ),
        )
      })
      return client
    },
    [setChannels],
  )

  const getSubscribedChannels = useCallback(
    (client) =>
      client.getSubscribedChannels().then((paginator) => {
        channelPaginator.current = paginator
        const newChannels = TwilioService.getInstance()
          .parseChannels(channelPaginator?.current?.items)
        setChannels(newChannels)
      }),
    [setChannels],
  )

  useEffect(() => {
    const getChannels = async () => {
      try {
        const token = await getToken(username)
        await TwilioService.getInstance().getChatClient(token)
        const clientWithListener = await TwilioService.getInstance().addTokenListener(getToken)
        await getSubscribedChannels(clientWithListener)
      } catch (err) {
        showMessage({ message: err.message, type: 'danger' })
      } finally {
        setLoading(false)
      }
    }

    getChannels()

    return () => TwilioService.getInstance().clientShutdown()
  }, [username, setChannelEvents, getSubscribedChannels])

  const sortedChannels = useMemo(
    () => channels.sort((channelA, channelB) => channelB.lastMessageTime -
      channelA.lastMessageTime),
    [channels],
  )

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={sortedChannels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              channel={item}
              onPress={
                () => navigation.navigate({
                  name: 'MessagesScreen',
                  params: { channelId: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={<ChatListEmpty />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  addButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.amaranth,
  },
})

