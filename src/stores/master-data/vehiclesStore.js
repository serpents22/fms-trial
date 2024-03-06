import { defineStore } from 'pinia'
import vehiclesAPI from '@/services/master-data/vehiclesAPI'
import { ref } from 'vue'

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    vehicles: ref(''),
    vehicle: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createVehicleIsLoading: ref(false),
    getVehicleIsLoading: ref(false),
    updateVehicleIsLoading: ref(false),
    deleteVehicleIsLoading: ref(false)
  }),
  actions: {
    async createVehicle(data) {
      this.createVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.createVehicle(data)
        console.log(res)
        this.createVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createVehicleIsLoading = false                
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async getVehicles(params) {
      this.getVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.getVehicles(params)
        this.vehicles = res.data.vehicles.map((item, index) => {
          const no = index+1
          const contractorName = item.contractor.name
          return { ...item, no, contractorName}
        })
        this.getVehicleIsLoading = false
      } catch (err) {
        this.getStatus.code = err.code
        this.getStatus.isError = true
        switch (this.getStatus.code) {
          case 'ERR_NETWORK':
            this.getStatus.message = 'Network Error'
            break;
        }
        this.getVehicleIsLoading = false
        console.error(err)
        return err
      }
    },
    async getVehicle(id) {
      this.getVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.getVehicle(id)
        console.log(res.data)
        this.vehicle = res.data.vehicle
        this.getVehicleIsLoading = false
      } catch (err) {
        this.getStatus.code = err.code
        this.getStatus.isError = true
        switch (this.getStatus.code) {
          case 'ERR_NETWORK':
            this.getStatus.message = 'Network Error'
            break;
        }
        this.getVehicleIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateVehicle(id,data) {
      this.updateVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.updateVehicle(id,data)
        console.log(res)
        this.updateVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateVehicleIsLoading = false            
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async deleteVehicle(id) {
      this.deleteVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.deleteVehicle(id)
        this.deleteVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteVehicleIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})