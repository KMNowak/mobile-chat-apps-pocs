import React, { FC } from 'react'
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { RootStackParamList } from '../navigation/types'
import { Text, View } from '../components/Themed'
import { images } from '../assets'
import colors from '../common/Colors'
import { useUser } from '../contexts/user.context'

type NavigationProps = StackNavigationProp<RootStackParamList,
  'WelcomeScreen'>

type RouteProps = RouteProp<RootStackParamList, 'WelcomeScreen'>

type Props = {
  navigation: NavigationProps
  route: RouteProps
}

export const WelcomeScreen: FC<Props> = ({ navigation }) => {
  const { username, setUsername } = useUser()

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={images.logo} />
      <Text style={styles.titleText}>Welcome to Twilio Chat</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity
        disabled={!username}
        style={styles.button}
        onPress={() => navigation.navigate('ChatListScreen')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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

