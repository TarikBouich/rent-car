<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6 flex flex-col items-center">
      <div class="text-center mb-6">
         <h1 class="text-xl font-black text-gray-900 mb-1 uppercase">Signature du Contrat</h1>
         <p v-if="!isVerified && localStatus === 'pending'" class="text-sm text-gray-500">Document verrouillé. Veuillez saisir le Code Secret reçu par message.</p>
         <p v-else-if="localStatus === 'pending'" class="text-sm text-gray-500">Tracez votre signature avec le doigt ci-dessous pour valider la procédure.</p>
      </div>

      <div v-if="localStatus === 'signed'" class="flex flex-col items-center py-10">
         <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
           <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
         </div>
         <h2 class="text-xl font-bold text-gray-900">Validé !</h2>
         <p class="text-sm text-gray-500">Votre signature a bien été transmise à l'agence.</p>
      </div>

      <div v-else-if="localStatus === 'expired'" class="flex flex-col items-center py-10">
         <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
           <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
         </div>
         <h2 class="text-xl font-bold text-gray-900">Lien Expiré</h2>
         <p class="text-sm text-gray-500 text-center px-4">Ce lien n'est plus valide ou la signature a déjà été réceptionnée par l'agence.</p>
      </div>

      <div v-else-if="!isVerified" class="w-full flex flex-col items-center py-6">
         <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
         </div>
         <form @submit.prevent="handlePinSubmit" class="w-full flex flex-col items-center">
            <input 
               type="text" 
               inputmode="numeric" 
               pattern="[0-9]*" 
               maxlength="6" 
               v-model="pinInput" 
               class="w-48 text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-300 rounded-xl py-3 focus:border-blue-500 focus:ring-blue-500 focus:outline-none mb-4"
               placeholder="------"
               required
            >
            <p v-if="pinError" class="text-red-500 text-sm mb-4 font-medium">{{ pinError }}</p>
            <button 
               type="submit" 
               class="w-48 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center disabled:opacity-50"
               :disabled="isVerifying || pinInput.length !== 6"
            >
               <svg v-if="isVerifying" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Déverrouiller
            </button>
         </form>
      </div>

      <div v-else class="w-full flex flex-col items-center">
        <!-- Canvas Container -->
        <div class="relative bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg w-full h-64 mb-6 touch-none">
          <canvas 
             ref="canvas" 
             class="absolute inset-0 w-full h-full cursor-crosshair touch-none"
             @mousedown="startDrawing"
             @mousemove="draw"
             @mouseup="stopDrawing"
             @mouseleave="stopDrawing"
             @touchstart.prevent="startDrawingTouch"
             @touchmove.prevent="drawTouch"
             @touchend.prevent="stopDrawing"
          ></canvas>
        </div>

        <div class="flex w-full gap-3">
           <button @click="clearSignature" class="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200">
              Effacer
           </button>
           <button @click="submitSignature" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md disabled:bg-gray-400" :disabled="!hasDrawn">
              Valider
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSignatureStore } from '../stores/signatureStore'

const route = useRoute()
const signatureStore = useSignatureStore()
const token = route.params.token

const canvas = ref(null)
const ctx = ref(null)
const isDrawing = ref(false)
const hasDrawn = ref(false)
const localStatus = ref('pending') // pending, signed, expired

// PIN state
const isVerified = ref(false)
const pinInput = ref('')
const pinError = ref('')
const isVerifying = ref(false)

// Initialize canvas context
onMounted(async () => {
   // Check if this token is actually registered by the desktop app
   if (!token) {
      localStatus.value = 'expired'
      return
   }

   const session = await signatureStore.getSession(token)
   if (!session) {
      localStatus.value = 'expired'
      return
   }

   if (session.status === 'signed') {
      localStatus.value = 'signed' // Already signed!
      return;
   }
   
   // Wait for user to input PIN to initialize canvas
})

const handlePinSubmit = async () => {
   pinError.value = ''
   if (pinInput.value.length !== 6) {
      pinError.value = 'Le code doit contenir 6 chiffres.'
      return
   }
   
   isVerifying.value = true
   const isValid = await signatureStore.verifyPin(token, pinInput.value)
   isVerifying.value = false
   
   if (isValid) {
      isVerified.value = true
      // Canvas exists now because v-else is active after next tick
      setTimeout(initCanvas, 100)
   } else {
      pinError.value = 'Code invalide. Veuillez réessayer.'
      pinInput.value = ''
   }
}

const initCanvas = () => {
   if (canvas.value) {
      const c = canvas.value
      // Fix resolution mismatch for canvas
      const rect = c.getBoundingClientRect()
      c.width = rect.width * 2
      c.height = rect.height * 2
      
      const context = c.getContext('2d')
      context.scale(2, 2)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 3
      context.strokeStyle = '#000000'
      ctx.value = context
   }
}

// Mouse events
const startDrawing = (e) => {
   isDrawing.value = true
   hasDrawn.value = true
   const { x, y } = getMousePos(e)
   ctx.value.beginPath()
   ctx.value.moveTo(x, y)
}
const draw = (e) => {
   if (!isDrawing.value) return
   const { x, y } = getMousePos(e)
   ctx.value.lineTo(x, y)
   ctx.value.stroke()
}
const stopDrawing = () => {
   isDrawing.value = false
   ctx.value.closePath()
}
const getMousePos = (evt) => {
   const rect = canvas.value.getBoundingClientRect()
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   }
}

// Touch events map directly to coordinates for mobile
const startDrawingTouch = (e) => {
   if (e.touches && e.touches[0]) {
      startDrawing(e.touches[0])
   }
}
const drawTouch = (e) => {
   if (e.touches && e.touches[0]) {
      draw(e.touches[0])
   }
}

const clearSignature = () => {
   const c = canvas.value
   ctx.value.clearRect(0, 0, c.width, c.height)
   ctx.value.beginPath() // reset path
   hasDrawn.value = false
}

const submitSignature = async () => {
   if (!hasDrawn.value) return
   const dataUrl = canvas.value.toDataURL('image/png')
   
   // Sync with API Proxy (push to Node memory relay)
   await signatureStore.updateSignature(token, dataUrl)
   localStatus.value = 'signed'
}
</script>
