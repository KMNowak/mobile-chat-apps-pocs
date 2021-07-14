export enum EnvVariables {
  TwilioAuthServerUrl = 'TWILIO_AUTH_SERVER_URL'
}

const getEnv = (envName: EnvVariables, defaultValue?: string) => {
  const value = process.env[envName]

  if (!defaultValue && (value === null || value === '' || value === undefined)) {
    console.error(`[ERROR]: Received env ${JSON.stringify(process.env)}`)
    throw new Error(`Missing env variable ${envName}`)
  }

  return value || defaultValue
}

export const envs = {
  TwilioAuthServerUrl: getEnv(EnvVariables.TwilioAuthServerUrl, 'http://10.150.35.135:3001/'),
}
