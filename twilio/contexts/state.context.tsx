import React, { FC } from 'react'

import { ChannelsContextProvider } from './channels.context'
import { UserContextProvider } from './user.context'

export const StateContextProvider: FC = ({ children }) => {
  return (
    <ChannelsContextProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </ChannelsContextProvider>
  )
}
