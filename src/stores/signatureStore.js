import { defineStore } from 'pinia'

// Rebuilt to use the Vite Dev Server API proxy relay for cross-device networking.
export const useSignatureStore = defineStore('signature', {
  state: () => ({}),
  actions: {
    async createSession(token, pin) {
      try {
         console.log('Sending CREATE session for token:', token)
         const res = await fetch('/api/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'CREATE', token, pin })
         })
         console.log('CREATE result:', await res.text())
      } catch (e) { console.error('Relay error CREATE', e) }
    },
    async verifyPin(token, pin) {
      try {
         const res = await fetch('/api/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'VERIFY', token, pin })
         })
         const data = await res.json()
         return data.success === true
      } catch (e) { 
         console.error('Relay error VERIFY', e) 
         return false
      }
    },
    async updateSignature(token, dataUrl) {
      try {
         console.log('Sending UPDATE session for token:', token)
         await fetch('/api/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'UPDATE', token, dataUrl })
         })
      } catch (e) { console.error('Relay error UPDATE', e) }
    },
    async removeSession(token) {
      try {
         await fetch('/api/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'DELETE', token })
         })
      } catch (e) { console.error('Relay error DELETE', e) }
    },
    async getSession(token) {
      try {
         console.log('Fetching session for token:', token)
         const res = await fetch(`/api/signature?token=${token}`)
         const text = await res.text()
         console.log('Raw result from GET API:', text)
         return JSON.parse(text)
      } catch (e) { 
         console.error('Relay error GET', e)
         return null 
      }
    }
  }
})
