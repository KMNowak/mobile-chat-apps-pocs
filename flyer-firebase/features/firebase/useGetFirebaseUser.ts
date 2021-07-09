import { getUser } from './firebase.logic'
import { useEffect } from 'react'

export const useGetFirebaseUser = () => {
  useEffect(() => {
    getUser();
  }, [getUser])
}
