import { defineStore } from 'pinia'
import router from '@/router'
import authAPI from '@/services/auth/authAPI'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('auth.user'),
    accessToken: localStorage.getItem('auth.accessToken'),
    refreshToken: localStorage.getItem('auth.refreshToken'),
    status: ref({
      isError: null,
      message: null,
      code: null,
    }),
    isLoading: ref(false)
  }),
  actions: {
    async signUp(data) {
      this.isLoading = true
      try {
        const res = await authAPI.signUp(data)
        console.log(res)
        this.isLoading = false
        this.status.message = 'Account Created'
        this.status.code = res.data.status
        router.push({ name: 'EmailConfirmation' });
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },

    async signIn(data) {
      this.isLoading = true
      try {
        const res = await authAPI.signIn(data)
        console.log(res)
        this.isLoading = false
        this.accessToken = res.data.accessToken
        this.refreshToken = res.data.refreshToken
        this.status.message = 'Login Successful'
        this.status.code = res.data.status
        this.status.isError = false
        localStorage.setItem('auth.accessToken', res.data.accessToken)
        localStorage.setItem('auth.refreshToken', res.data.refreshToken)
        router.push({ name: 'Dashboard' })
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        if (err.code === "ERR_NETWORK") {
          this.status.code = err.response.status
        } else {
          this.status.code = err.response.status
        }
        //define message 
        switch (this.status.code) {
          case 0:
            this.status.message = "Network Error"
            break;
          case 400:
            this.status.message = err.response.statusText
            break;
          case 401:
            this.status.message = err.response.statusText
            break;
          case 403:
            this.status.message = "Sorry! You don't have permission to access that page. Please contact support if you believe this is an error."
            break;
          case 404:
            this.status.message = err.response.statusText
            break;
          case 500:
            this.status.message = "Yikes! Something went wrong on our end. Please try again later or contact support if the issue persists."
            break;
          case 502:
            this.status.message = "Oops! We're having trouble connecting to the server. Please try again later or contact support if the issue persists."
            break;
          case 503:
            this.status.message = "Hold tight! We're performing maintenance on our servers. Please try again later."
            break;
        }
        console.log(this.status)
        return err
      }
    },

    async signOut() {
      localStorage.removeItem('auth.accessToken');
      localStorage.removeItem('auth.user')
      router.push({ name: 'Login Page' });
    },

    async forgotPassword(data) {

      this.isLoading = true
      try {
        const res = await authAPI.forgotPassword(data)
        this.isLoading = false
        this.status.message = 'Password reset email successfully sent'
      } catch (err) {
        this.isLoading = false
        this.status.message = err.response.data.error.errors[0].message
        return err
      }
    },

    async newPassword(data, email, signature) {
      this.isLoading = true
      try {
        await authAPI.newPassword(data, email, signature)
        this.isLoading = false
        router.push({ name: 'ResetPasswordConfirmation' });
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },

  }

})