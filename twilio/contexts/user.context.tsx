import React, { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react'

type UserContext = {
  username: string;
  setUsername?: Dispatch<SetStateAction<string>>
}

const UserContext = createContext<UserContext>({
  username: '',
})

export const useUser = () => useContext<UserContext>(UserContext)

export const UserContextProvider: FC = ({ children }) => {
  const [username, setUsername] = useState('')

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
    }}>
      {children}
    </UserContext.Provider>
  )
}
