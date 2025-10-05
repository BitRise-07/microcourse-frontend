import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'https://microcourse-backend.vercel.app',
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('token') || localStorage.getItem('mc_token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data ? 'with data' : '')
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status, response.data ? 'with data' : '')
    return response
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, 'Status:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api


