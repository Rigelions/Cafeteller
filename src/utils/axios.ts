// set up base api for axios
import axios from 'axios'
import { getAuth } from '@firebase/auth'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const instance_server = axios.create({
  baseURL: process.env.NEXT_PRIVATE_API_URL
})

// add a request interceptor, firebase id token
instance.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      // If it's server-side, skip adding the Firebase token
      return config
    }

    const auth = getAuth()
    // if no app initialized yet, return config
    if (!auth) return config

    const user = auth.currentUser
    const token = await user?.getIdToken(true)
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
