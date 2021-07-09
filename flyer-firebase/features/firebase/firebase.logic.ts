import firebase from 'firebase'

export const getUser = async () => {
  const user = firebase.auth().currentUser

  if (!user) {
    const newUser = await firebase.auth().signInAnonymously()

    return newUser.user
  }

  return user
}
