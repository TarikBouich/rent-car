<template>
  <div v-if="isOpen" class="absolute z-50 mt-1 w-full min-w-[300px] sm:min-w-[400px] max-w-lg bg-gray-200 dark:bg-gray-800 p-2 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 right-0">
    <div class="flex justify-between items-center mb-2 px-2">
      <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Clavier Arabe (لوحة المفاتيح)</span>
      <button @click="$emit('close')" type="button" class="text-gray-500 hover:text-red-500 transition-colors p-1 bg-white dark:bg-gray-700 rounded-full">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <div class="simple-keyboard text-gray-900" ref="keyboardRef"></div>
  </div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import arabicLayout from "simple-keyboard-layouts/build/layouts/arabic";

export default {
  name: "ArabicKeyboard",
  props: {
    isOpen: Boolean,
    modelValue: String,
  },
  emits: ["update:modelValue", "close"],
  data: () => ({
    keyboard: null
  }),
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (!this.keyboard) {
            this.keyboard = new Keyboard(this.$refs.keyboardRef, {
              onChange: input => this.$emit("update:modelValue", input),
              onKeyPress: button => this.onKeyPress(button),
              layout: arabicLayout.layout,
              display: {
                "{bksp}": "⌫ Retour",
                "{enter}": "Entrée",
                "{shift}": "Maj",
                "{space}": "Espace",
                "{lock}": "Verr. Maj",
                "{tab}": "Tab"
              },
              theme: "hg-theme-default hg-layout-numeric arabic-theme"
            });
          }
          this.keyboard.setInput(this.modelValue || "");
        });
      }
    },
    modelValue(newVal) {
      if (this.keyboard && newVal !== this.keyboard.getInput()) {
        this.keyboard.setInput(newVal || "");
      }
    }
  },
  methods: {
    onKeyPress(button) {
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  }
};
</script>

<style>
/* Custom overrides for the keyboard to match our UI */
.arabic-theme.hg-theme-default {
  background-color: transparent !important;
  padding: 0 !important;
}
.arabic-theme .hg-button {
  background: white !important;
  border-bottom: 2px solid #e5e7eb !important;
  color: #111827 !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
  height: 40px !important;
}
.arabic-theme .hg-button:active {
  background: #f3f4f6 !important;
  border-bottom: 0 !important;
  transform: translateY(2px) !important;
}

/* Dark mode overrides (Assuming `.dark` class is on html) */
html.dark .arabic-theme .hg-button {
  background: #374151 !important;
  border-bottom: 2px solid #1f2937 !important;
  color: #f9fafb !important;
}
html.dark .arabic-theme .hg-button:active {
  background: #4b5563 !important;
  border-bottom: 0 !important;
}
</style>
