<template>
  <!-- Theme Toggle Button Component -->
  <button 
    class="theme-toggle" 
    @click="toggleTheme"
    :title="toggleButtonTitle"
    aria-label="Toggle theme"
  >
    <!-- Icon changes based on current theme -->
    <span class="theme-icon">
      {{ themeStore.isDark ? '☀️' : '🌙' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useThemeStore } from '../stores/theme'

/**
 * Theme Toggle Component
 * Provides a button to switch between light and dark themes
 */

// Get theme store instance
const themeStore = useThemeStore()

/**
 * Computed property for button title text
 * Updates based on current theme
 */
const toggleButtonTitle = computed(() => {
  return themeStore.isDark 
    ? 'Switch to light theme' 
    : 'Switch to dark theme'
})

/**
 * Toggle theme function
 * Calls the store action and saves to localStorage
 */
const toggleTheme = () => {
  themeStore.toggleTheme()
  themeStore.saveTheme()
}

/**
 * Initialize theme on component mount
 */
onMounted(() => {
  themeStore.initializeTheme()
})

/**
 * Watch for theme changes and save automatically
 */
watch(
  () => themeStore.currentTheme,
  () => {
    themeStore.saveTheme()
  }
)
</script>

<style scoped>
/* Theme toggle styles are already defined in main.css */
</style> 