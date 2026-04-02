import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: []
  }),
  getters: {
    getAllTransactions: (state) => state.transactions,
    getTransactionsByAgency: (state) => (agencyId) => {
      return state.transactions.filter(t => t.agencyId === agencyId)
    },
    getAgencyEspeceFlow: (state) => (agencyId) => {
      const txs = state.transactions.filter(t => t.agencyId === agencyId && t.method === 'espece')
      return txs.reduce((acc, t) => acc + (t.type === 'revenue' ? t.amount : -t.amount), 0)
    },
    getAgencyBanqueFlow: (state) => (agencyId) => {
      const txs = state.transactions.filter(t => t.agencyId === agencyId && t.method !== 'espece')
      return txs.reduce((acc, t) => acc + (t.type === 'revenue' ? t.amount : -t.amount), 0)
    }
  },
  actions: {
    initializeFromStorage() {
        const stored = localStorage.getItem('transactions')
        if (stored) {
            this.transactions = JSON.parse(stored)
        }
    },
    addTransaction(transaction) {
      if(!this.transactions.length) this.initializeFromStorage()
      const userStore = useUserStore()

      const newTx = {
        ...transaction,
        id: generateNextId(this.transactions),
        date: transaction.date || new Date().toISOString(),
        companyId: userStore.userCompanyId
      }
      this.transactions.push(newTx)
      this.saveTransactions()
      return newTx
    },
    saveTransactions() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    }
  }
})
