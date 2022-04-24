import axios, { AxiosInstance } from 'axios'

const api:AxiosInstance = axios.create({
  baseURL:`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api`
})

export default api