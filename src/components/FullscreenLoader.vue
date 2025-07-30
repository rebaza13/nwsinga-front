<template>
  <div v-if="visible" :class="['fullscreen-loader', themeStore.isDark ? 'theme-dark' : 'theme-light']">
    <div class="loader-content">
      <!-- Logo -->
      <div class="loader-logo">
        <img 
          :src="logoUrl" 
          alt="Real Estate Logo" 
          class="logo-image"
        />
      </div>
      
      <!-- Loading Text -->
      <h1 class="loader-title">{{ t('loader.title') }}</h1>
      <p class="loader-subtitle">{{ t('loader.subtitle') }}</p>
      
      <!-- Loading Spinner -->
      <div class="loader-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <!-- Progress Bar -->
      <div class="loader-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ Math.round(progress || 0) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'

/**
 * Fullscreen Loader Component
 * Beautiful loading screen with theme-aware logo
 */

// Define component props
const props = defineProps<{
  visible: boolean
  progress?: number
}>()

// Get theme store
const themeStore = useThemeStore()

const { t } = useI18n()

// Computed logo URL based on theme
const logoUrl = computed(() => {
  return themeStore.isDark 
    ? new URL('../assets/for black theme.jpeg', import.meta.url).href
    : new URL('../assets/for white theme.png', import.meta.url).href
})
</script>

<style scoped>
/**
 * Fullscreen Loader Styles
 * Beautiful loading screen with smooth animations
 */
.fullscreen-loader {
  position: fixed;
  inset: 0;
  background: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.5s ease-out;
  /* Ensure proper display in both LTR and RTL */
  direction: ltr;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/**
 * Loader Content
 */
.loader-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

/**
 * Logo Section
 */
.loader-logo {
  margin-bottom: 2rem;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-image {
  max-width: 200px;
  height: auto;
  border-radius: 12px;
}

/**
 * Loading Text
 */
.loader-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-text);
  margin-bottom: 1rem;
  animation: titleSlideIn 0.8s ease-out 0.2s both;
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-subtitle {
  font-size: 1.1rem;
  color: var(--muted-text);
  margin-bottom: 3rem;
  animation: subtitleSlideIn 0.8s ease-out 0.4s both;
}

@keyframes subtitleSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Loading Spinner
 */
.loader-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  animation: spinnerSlideIn 0.8s ease-out 0.6s both;
}

@keyframes spinnerSlideIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--accent-bg);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-top-color: var(--primary-text);
  animation-delay: -0.5s;
}

.spinner-ring:nth-child(3) {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border-top-color: var(--border-color);
  animation-delay: -1s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/**
 * Progress Bar
 */
.loader-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: progressSlideIn 0.8s ease-out 0.8s both;
}

@keyframes progressSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: var(--secondary-bg);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-bg), var(--primary-text));
  border-radius: 3px;
  transition: width 0.3s ease;
  animation: progressPulse 2s ease-in-out infinite;
}

@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-text);
  min-width: 40px;
}

/**
 * Responsive Design
 */
@media (max-width: 768px) {
  .loader-content {
    padding: 1.5rem;
  }
  
  .loader-title {
    font-size: 2rem;
  }
  
  .loader-subtitle {
    font-size: 1rem;
  }
  
  .loader-spinner {
    width: 60px;
    height: 60px;
  }
  
  .spinner-ring {
    border-width: 2px;
  }
}

@media (max-width: 480px) {
  .loader-title {
    font-size: 1.75rem;
  }
  
  .loader-subtitle {
    font-size: 0.9rem;
  }
  
  .loader-spinner {
    width: 50px;
    height: 50px;
  }
}

/**
 * Accessibility Improvements
 */
@media (prefers-reduced-motion: reduce) {
  .loader-logo {
    animation: none;
  }
  
  .loader-title,
  .loader-subtitle,
  .loader-spinner,
  .loader-progress {
    animation: none;
  }
  
  .spinner-ring {
    animation: none;
  }
  
  .progress-fill {
    animation: none;
  }
}

/**
 * RTL Support
 * Ensure loader displays properly in both LTR and RTL languages
 */
[dir="rtl"] .fullscreen-loader {
  direction: ltr; /* Keep loader content LTR for consistent display */
}

[dir="rtl"] .loader-content {
  direction: ltr; /* Ensure content layout remains consistent */
}

/* Force proper positioning in RTL */
html[dir="rtl"] .fullscreen-loader {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.theme-dark.fullscreen-loader {
  background: #181818;
}
.theme-light.fullscreen-loader {
  background: #fff;
}
.theme-dark .loader-title,
.theme-dark .progress-text {
  color: #fff;
}
.theme-light .loader-title,
.theme-light .progress-text {
  color: #222;
}
.theme-dark .loader-subtitle {
  color: #aaa;
}
.theme-light .loader-subtitle {
  color: #666;
}
</style>