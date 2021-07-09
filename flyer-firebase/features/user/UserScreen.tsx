import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, StyleSheet, TextInput } from 'react-native'
import { createUserInFirestore, fetchUser, User } from '@flyerhq/react-native-firebase-chat-core'
import { Text, View } from '../../components/Themed'
import { getUser } from '../firebase/firebase.logic'
import firebase from 'firebase'

export const UserScreen = () => {
  const [user, setUser] = useState<User>()
  const [firebaseUser, setFirebaseUser] = useState<firebase.User>()
  const [firstName, setFirstName] = useState<string | undefined>('')

  useEffect(() => {
    getUser().then(async (receivedFirebaseUser) => {
      if (!receivedFirebaseUser) {
        throw 'Could not get firebase user'
      }

      setFirebaseUser(receivedFirebaseUser)

      const user = await fetchUser(receivedFirebaseUser.uid)

      if (user) {
        setUser(user)
        setFirstName(user.firstName)
      }
    })
  }, [])

  const onPressCreateUser = async () => {
    if (user) {
      await createUserInFirestore({
        id: user?.id,
        firstName,
      })

      return firebaseUser ? fetchUser(firebaseUser.uid) : null
    }
  }

  const renderEnterUserDataForm = () => (
    <View>
      <TextInput onChangeText={setFirstName} />
      <Button title={'Create user'} onPress={onPressCreateUser} />
    </View>
  )

  const renderGreetings = () => <Text style={styles.title}>Hello {firstName}</Text>

  return (
    <View style={styles.container}>
      {
        user
          ? renderGreetings()
          : renderEnterUserDataForm()
      }

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
