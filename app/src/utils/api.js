import axios from 'axios'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import router from '@/router/router';

export const IS_PRODUCTION = 'sandbox'
export const BASE_URL = `http://${window.location.hostname}:3000/api`

var currentUser = null
var callbackCreated = false
const CLIENT_TIMEOUT_DEV = 300000
const MAX_RETRIES = 3

const apiInstance = axios.create({
    baseURL: BASE_URL,
    timeout: CLIENT_TIMEOUT_DEV,
})

apiInstance.interceptors.request.use(
  (config) => {
    let auth = getAuth()
    if (!callbackCreated) {
      currentUser = auth.currentUser
      onAuthStateChanged(auth, updateUser)
      callbackCreated = true
    }
    config.headers['Access-Control-Allow-Origin'] = window.location.hostname
    let route = router.currentRoute
    let domain = route.params?.domain
    if (domain) config.headers['X-Lonche-Domain'] = domain
    if (currentUser !== null) {
      return currentUser
        .getIdToken()
        .then((token) => {
          config.headers['Authorization'] = 'Bearer ' + token
          config.headers['Access-Control-Allow-Headers'] = 'authorization'
          return config
        })
        .catch((error) => {
          throw error
        })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiInstance.interceptors.response.use(undefined, (err) => {
  const { config, message, response } = err
  let retry = true
  if (response) retry = [502, 503, 504].includes(response.status)
  else if (!(message.includes('timeout') || message.includes('Network Error')))
    retry = false
  if (!retry) return Promise.reject(err)
  if (config.retry === undefined) config.retry = 0
  config.retry += 1
  if (config.retry > MAX_RETRIES) return Promise.reject(err)
  const delayRetryRequest = new Promise((resolve) => {
    setTimeout(() => {
      console.log('retry the request', config.url)
      resolve()
    }, (config.retryDelay || 1000) * Math.pow(2, config.retry))
  })
  return delayRetryRequest.then(() => apiInstance(config))
})

function updateUser(user) {
  currentUser = user
}

export const api = apiInstance
