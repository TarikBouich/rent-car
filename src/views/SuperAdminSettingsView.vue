<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Paramètres Super Admin
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configurez les coordonnées de contact visibles par les clients.
        </p>
      </div>

      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <form @submit.prevent="saveContact" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email de contact
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="support@rentcar.com"
              class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-white dark:bg-[#151923] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone de contact
            </label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="+212 6 00 00 00 00"
              class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-white dark:bg-[#151923] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div v-if="message" class="text-sm" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">
            {{ message }}
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2.5 bg-[#fa5b0f] text-white rounded-lg text-sm font-medium hover:bg-[#e04f0b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import companyService from '../services/companyService'

const form = ref({
  email: '',
  phone: ''
})

const isSaving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadContact = async () => {
  try {
    const { data } = await companyService.getSupportContact()
    form.value.email = data?.email || ''
    form.value.phone = data?.phone || ''
  } catch (error) {
    try {
      // Backward-compatible fallback while backend endpoint is not yet deployed/restarted
      const legacy = await companyService.getById('COMP-SUPERADMIN')
      form.value.email = legacy?.data?.email || ''
      form.value.phone = legacy?.data?.phone || ''
    } catch (legacyError) {
      messageType.value = 'error'
      message.value = "Impossible de charger les coordonnées de contact."
      console.error('Failed loading support contact:', error)
      console.error('Failed loading legacy support contact:', legacyError)
    }
  }
}

const saveContact = async () => {
  isSaving.value = true
  message.value = ''
  try {
    const payload = {
      email: form.value.email?.trim(),
      phone: form.value.phone?.trim()
    }
    await companyService.updateSupportContact(payload)
    messageType.value = 'success'
    message.value = 'Coordonnées enregistrées avec succès.'
  } catch (error) {
    try {
      const payload = {
        email: form.value.email?.trim(),
        phone: form.value.phone?.trim()
      }
      await companyService.update('COMP-SUPERADMIN', payload)
      messageType.value = 'success'
      message.value = 'Coordonnées enregistrées avec succès.'
    } catch (legacyError) {
      messageType.value = 'error'
      message.value = legacyError?.response?.data?.message || error?.response?.data?.message || "Échec de l'enregistrement."
      console.error('Failed saving support contact:', error)
      console.error('Failed saving legacy support contact:', legacyError)
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadContact()
})
</script>
