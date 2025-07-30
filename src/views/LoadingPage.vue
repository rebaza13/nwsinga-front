<template>
  <div class="loading-page">
    <div class="loader-container">
      <img 
        :src="logoSrc" 
        alt="Loading..." 
        class="loading-logo"
      />
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ $t('loading') || 'Loading...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = ref(false)

// Detect theme
const detectTheme = () => {
  const savedTheme = localStorage.getItem('vue-ts-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

const logoSrc = computed(() => {
  return isDark.value ? '/for%20black%20theme.jpeg' : '/for%20white%20theme.png'
})

onMounted(() => {
  detectTheme()
  
  // Navigate to home page after 1 second
  setTimeout(() => {
    router.push('/home')
  }, 1000)
})
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background, #fff);
  z-index: 9999;
}

[data-theme="dark"] .loading-page {
  background: var(--color-background, #000);
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-logo {
  max-width: 160px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid var(--color-primary, #007bff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

[data-theme="dark"] .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--color-primary, #007bff);
}

.loading-text {
  color: var(--color-text, #333);
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.8;
}

[data-theme="dark"] .loading-text {
  color: var(--color-text, #fff);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .loading-logo {
    max-width: 120px;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
  
  .loading-text {
    font-size: 0.9rem;
  }
}
</style>
