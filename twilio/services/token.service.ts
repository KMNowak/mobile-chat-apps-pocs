import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import { envs } from '../common/config'

export const getToken = (username: string) =>
  axios.get(`${envs.TwilioAuthServerUrl}token/${username}`)
    .then((twilioUser) => twilioUser.data.jwt)
    .catch(err => {
      console.error('[ERROR] get token error:', JSON.stringify(err))
      showMessage({ message: JSON.stringify(err), type: 'danger' })
    })
