<template>
  <div class="car-damage-map select-none relative" ref="containerRef">
    <!-- Readonly text indicator -->
    <div v-if="readonly" class="absolute top-2 left-2 bg-gray-800 text-white text-[10px] uppercase px-2 py-0.5 rounded shadow opacity-50 pointer-events-none z-10">
      Mode Lecture
    </div>
    
    <!-- SVG Canvas -->
    <svg 
      class="w-full h-auto drop-shadow-sm transition-all" 
      :class="[readonly ? 'cursor-default opacity-90' : 'cursor-crosshair hover:drop-shadow-md']"
      viewBox="0 0 500 300" 
      @click="handleMapClick"
    >
      <!-- Base Chassis Background -->
      <rect x="0" y="0" width="500" height="300" fill="transparent" />

      <!-- CAR EXPLODED VECTOR DESIGN -->
      <g class="car-vector text-gray-800 dark:text-gray-300 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        
        <!-- Main Top-Down Body (Center) -->
        <!-- Bounding: X from 150 to 350, Y from 50 to 250 -->
        <rect x="150" y="50" width="200" height="200" rx="20" fill="#f8fafc" class="dark:fill-[#1E2330]" />
        
        <!-- Front Hood (Right side if facing right, let's say car faces Right) -->
        <path d="M 330 65 L 430 80 Q 450 150 430 220 L 330 235 Z" fill="#f1f5f9" class="dark:fill-[#151923]" />
        
        <!-- Rear Trunk (Left side) -->
        <path d="M 170 65 L 70 80 Q 50 150 70 220 L 170 235 Z" fill="#f1f5f9" class="dark:fill-[#151923]" />

        <!-- Windshield (Front) -->
        <path d="M 280 70 L 320 85 L 320 215 L 280 230 Z" fill="#e2e8f0" class="dark:fill-[#0f172a]" />
        
        <!-- Back Window (Rear) -->
        <path d="M 200 70 L 170 85 L 170 215 L 200 230 Z" fill="#e2e8f0" class="dark:fill-[#0f172a]" />

        <!-- Top Roof line -->
        <rect x="200" y="70" width="80" height="160" rx="10" />

        <!-- Left Doors (Top view, unfolded upwards) -->
        <path d="M 170 45 L 210 10 L 300 10 L 320 45 Z" fill="#f8fafc" class="dark:fill-[#1E2330]" />
        
        <!-- Right Doors (Bottom view, unfolded downwards) -->
        <path d="M 170 255 L 210 290 L 300 290 L 320 255 Z" fill="#f8fafc" class="dark:fill-[#1E2330]" />

        <!-- Headlights -->
        <ellipse cx="435" cy="100" rx="8" ry="15" fill="#fef08a" stroke="none" />
        <ellipse cx="435" cy="200" rx="8" ry="15" fill="#fef08a" stroke="none" />

        <!-- Taillights -->
        <ellipse cx="65" cy="100" rx="8" ry="15" fill="#f87171" stroke="none" />
        <ellipse cx="65" cy="200" rx="8" ry="15" fill="#f87171" stroke="none" />

        <!-- Wheels (Top) -->
        <rect x="130" y="30" width="50" height="15" rx="5" fill="#334155" stroke="none" />
        <rect x="330" y="30" width="50" height="15" rx="5" fill="#334155" stroke="none" />
        
        <!-- Wheels (Bottom) -->
        <rect x="130" y="255" width="50" height="15" rx="5" fill="#334155" stroke="none" />
        <rect x="330" y="255" width="50" height="15" rx="5" fill="#334155" stroke="none" />
      </g>

      <!-- Draw existing markers -->
      <g v-for="(marker, index) in modelValue" :key="index">
        
        <!-- RED "X" MARKER -->
        <g v-if="!marker.type || marker.type === 'x'">
           <circle 
             :cx="marker.x" 
             :cy="marker.y" 
             r="14" 
             fill="none" 
             stroke="#ef4444" 
             stroke-width="3" 
             class="marker-circle"
           />
           <path 
             :d="`M ${marker.x - 8} ${marker.y - 8} L ${marker.x + 8} ${marker.y + 8} M ${marker.x + 8} ${marker.y - 8} L ${marker.x - 8} ${marker.y + 8}`" 
             stroke="#ef4444" 
             stroke-width="3" 
             stroke-linecap="round"
           />
        </g>
        
        <!-- GREEN "V" MARKER -->
        <g v-else-if="marker.type === 'v'">
           <circle 
             :cx="marker.x" 
             :cy="marker.y" 
             r="14" 
             fill="none" 
             stroke="#10b981" 
             stroke-width="3" 
             class="marker-circle"
           />
           <!-- Checkmark Path -->
           <path 
             :d="`M ${marker.x - 6} ${marker.y} L ${marker.x - 2} ${marker.y + 4} L ${marker.x + 6} ${marker.y - 6}`" 
             stroke="#10b981" 
             stroke-width="3" 
             stroke-linecap="round"
             stroke-linejoin="round"
             fill="none"
           />
        </g>

        <!-- Click interactor over marker -->
        <circle 
          v-if="!readonly"
          :cx="marker.x" 
          :cy="marker.y" 
          r="16" 
          fill="transparent" 
          stroke="none" 
          class="cursor-pointer transition-colors"
          :class="!marker.type || marker.type === 'x' ? 'hover:fill-green-500/20' : 'hover:fill-red-500/20'"
          @click.stop="toggleOrRemoveMarker(index)"
          :title="(!marker.type || marker.type === 'x') ? 'Marquer comme réparé' : 'Supprimer la marque'"
        />
      </g>

    </svg>
    <div v-if="!readonly" class="text-xs text-center text-gray-500 mt-2 font-medium leading-relaxed">
       Cliquez sur le schéma pour rajouter une marque de dégât (X).<br/>
       <span class="text-green-500">Cliquez sur un (X) rouge pour le marquer réparé (V).</span><br/>
       <span class="text-red-400">Cliquez sur un (V) vert pour le supprimer définitivement.</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const containerRef = ref(null)

const handleMapClick = (e) => {
  if (props.readonly) return

  // Need to get coordinates strictly relative to SVG viewBox (500x300)
  // We can calculate this by mapping the click bounding box ratio
  const svgEl = e.currentTarget
  const rect = svgEl.getBoundingClientRect()
  
  // click relative to physical dimensions
  const physicalX = e.clientX - rect.left
  const physicalY = e.clientY - rect.top
  
  // map to viewBox dimensions (500x300)
  const scaleX = 500 / rect.width
  const scaleY = 300 / rect.height
  
  const svgX = physicalX * scaleX
  const svgY = physicalY * scaleY

  const updatedDamage = [...props.modelValue, { x: Math.round(svgX), y: Math.round(svgY), type: 'x' }]
  emit('update:modelValue', updatedDamage)
}

const toggleOrRemoveMarker = (index) => {
  if (props.readonly) return
  const updated = [...props.modelValue]
  const marker = updated[index]
  
  if (!marker.type || marker.type === 'x') {
    // Transform X into V
    updated[index] = { ...marker, type: 'v' }
  } else {
    // Transform V into Removed
    updated.splice(index, 1)
  }
  
  emit('update:modelValue', updated)
}
</script>

<style scoped>
.marker-circle {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
