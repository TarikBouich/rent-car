import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

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
    async initializeFromStorage() {
      this.transactions = await loadStateJson('transactions', [])
    },
    addTransaction(transaction) {
      const userStore = useUserStore()
      const newTx = {
        ...transaction,
        id: generateNextId(this.transactions),
        date: transaction.date || new Date().toISOString(),
        companyId: userStore.userCompanyId
      }
      this.transactions.push(newTx)
      saveStateJson('transactions', this.transactions)
      return newTx
    }
  }
})
