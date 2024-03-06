// import axios from "axios";
import apiClient from "./API"

// const apiClient = axios.create({
//   baseURL: process.env.VUE_APP_API_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   }
// })

// const authInterceptor = (config) => {
//   config.headers.Authorization = 'Basic ' + btoa(`${process.env.VUE_APP_API_USER}:${process.env.VUE_APP_API_PASS}`)
//   return config
// }

// // Set up an interceptor to include bearer token
// apiClient.interceptors.request.use(authInterceptor)

export default {
  getLast(params) {
    return apiClient.get('data-device/last',{ params })
  },

  getHistory(params) {
    return apiClient.get('data-device/history',{ params })
  },

  getDevicesStatus() {
    return apiClient.get('data-device/tcp')
  },

  getDeviceStatus(imei) {
    return apiClient.get(`data-device/tcp/${imei}`) 
  },

  getLastDeviceGeo(params) {
    return apiClient.get(`data-device/geolocation/last`,{ params })
  },

  getHistoryDeviceGeo(params) {
    return apiClient.get(`data-device/geolocation/history`,{ params }) 
  },

  getVehicleLastDeviceGeo(params) {
    return apiClient.get(`vehicles/geolocation/last/`, {params})
  },

  getVehicleHistoryDeviceGeo(id,params) {
    return apiClient.get(`vehicles/geolocation/history/${id}`, {params}) 
  },

  getLastVehicleStatus(id) {
    return apiClient.get(`vehicles/tcpstatus/last/${id}`)
  },

}
