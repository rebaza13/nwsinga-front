import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Theme types for the application
 */
export type Theme = 'light' | 'dark'

/**
 * Pinia store for managing the application theme
 * Handles theme switching between light and dark modes
 */
export const useThemeStore = defineStore('theme', () => {
  // State: Current theme (reactive reference)
  const currentTheme = ref<Theme>('light') // Default to light theme

  // Computed: Check if current theme is dark
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // Computed: Check if current theme is light
  const isLight = computed(() => currentTheme.value === 'light')

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyThemeToDocument()
    saveTheme()
  }

  /**
   * Set a specific theme
   * @param theme - The theme to set ('light' or 'dark')
   */
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyThemeToDocument()
    saveTheme()
  }

  /**
   * Apply the current theme to the document body
   * This adds/removes CSS classes for theme styling
   */
  const applyThemeToDocument = () => {
    const body = document.body
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark')
    
    // Add current theme class
    body.classList.add(`theme-${currentTheme.value}`)
  }

  /**
   * Initialize the theme system
   * Loads saved theme from localStorage or uses default
   */
  const initializeTheme = () => {
    // Try to load saved theme from localStorage
    const savedTheme = localStorage.getItem('vue-ts-theme') as Theme
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      currentTheme.value = savedTheme
    }
    
    // Apply theme to document
    applyThemeToDocument()
  }

  /**
   * Save current theme to localStorage
   */
  const saveTheme = () => {
    localStorage.setItem('vue-ts-theme', currentTheme.value)
  }

  return {
    // State
    currentTheme,
    
    // Getters
    isDark,
    isLight,
    
    // Actions
    toggleTheme,
    setTheme,
    initializeTheme,
    saveTheme,
    applyThemeToDocument
  }
}) 