import { defineStore } from 'pinia'

export const useSignatureStore = defineStore('signature', {
  state: () => ({}),
  actions: {
    async createSession(token, pin) {
      const res = await fetch('/api/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', token, pin })
      })

      if (!res.ok) {
        throw new Error(`CREATE session failed (${res.status})`)
      }
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
        console.error('Signature verify error', e)
        return false
      }
    },
    async updateSignature(token, dataUrl) {
      try {
        const res = await fetch('/api/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'UPDATE', token, dataUrl })
        })
        return res.ok
      } catch (e) {
        console.error('Signature update error', e)
        return false
      }
    },
    async removeSession(token) {
      try {
        await fetch('/api/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'DELETE', token })
        })
      } catch (e) {
        console.error('Signature delete error', e)
      }
    },
    async getSession(token) {
      try {
        const res = await fetch(`/api/signature?token=${encodeURIComponent(token)}`)
        if (!res.ok) return null
        return await res.json()
      } catch (e) {
        console.error('Signature get error', e)
        return null
      }
    }
  }
})
