import React, { createContext, FC, useContext, useState } from 'react'


type ChannelsContexts = {
  channels: any[]
  setChannels: (prevChannels: ((prevChannels: any[]) => any) | any[]) => void
}

const ChannelsContext = createContext<ChannelsContexts>({
  channels: [],
  setChannels: () => {
  },
})

export const useChannels = () => useContext<ChannelsContexts>(ChannelsContext)

export const ChannelsContextProvider: FC = ({ children }) => {
  const [channels, setChannels] = useState<any[]>([])

  return (
    <ChannelsContext.Provider value={{
      channels,
      setChannels,
    }}>
      {children}
    </ChannelsContext.Provider>
  )
}
