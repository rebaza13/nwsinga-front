<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-flex">
          <!-- Details Left -->
          <div class="modal-details">
            <h2 class="modal-title">{{ house.title }}</h2>
            <div class="modal-info">
              <div class="modal-info-item">
                <span class="modal-icon">📐</span>
                <span>{{ house.square_m }} m²</span>
              </div>
              <div class="modal-info-item">
                <span class="modal-icon">🧭</span>
                <span>{{ house.direction }}</span>
              </div>
              <div class="modal-info-item" v-if="house.floor">
                <span class="modal-icon">🏢</span>
                <span>{{ t('modal.floor') }} {{ house.floor }}</span>
              </div>
              <!-- <div class="modal-info-item" v-if="house.owner_phone">
                <span class="modal-icon">📞</span>
                <span>{{ house.owner_phone }}</span>
              </div> -->
              <div class="modal-info-item" v-if="house.price">
                <span class="modal-icon">💲</span>
                <span>{{ t('modal.price') }} ${{ house.price }}</span>
              </div>
            </div>
            <p class="modal-desc">{{ house.description }}</p>
            <div class="modal-actions">
              <button class="modal-btn" @click="prevHouse" :disabled="currentIndex === 0">
                <span v-if="!isRtl">←</span>
                <span v-else>→</span>
                {{ t('modal.previous') }}
              </button>
              <button class="modal-btn" @click="nextHouse" :disabled="currentIndex === houses.length - 1">
                {{ t('modal.next') }}
                <span v-if="!isRtl">→</span>
                <span v-else>←</span>
              </button>
              <button class="modal-btn modal-close" @click="closeModal">{{ t('modal.close') }}</button>
            </div>
          </div>
          <!-- Image Right -->
          <div class="modal-gallery">
            <img 
              :src="images[mainImageIndex]" 
              class="modal-main-img" 
              :alt="house.title"
              loading="lazy"
            />
            <div v-if="images.length > 1" class="modal-thumbnails">
              <button class="thumb-nav" @click="prevImage" :disabled="mainImageIndex === 0">
                <span v-if="!isRtl">&#x2039;</span><!-- ‹ -->
                <span v-else>&#x2039;</span><!-- ‹ -->
              </button>
              <img
                v-for="(img, idx) in images"
                :key="img + idx"
                :src="img"
                :alt="'thumb-' + idx"
                class="modal-thumb"
                :class="{ active: idx === mainImageIndex }"
                @click="setMainImage(idx)"
              />
              <button class="thumb-nav" @click="nextImage" :disabled="mainImageIndex === images.length - 1">
                <span v-if="!isRtl">&#x203A;</span><!-- › -->
                <span v-else>&#x203A;</span><!-- › -->
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { HouseModalProps } from '../types/house'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'

/**
 * House Modal Component
 * Displays house details in a beautiful modal with navigation
 */

// Define component props
const props = defineProps<HouseModalProps>()

// Define component events
const emit = defineEmits<{
  close: []
  navigate: [index: number]
}>()

const { t, locale } = useI18n()
const isRtl = computed(() => locale.value === 'ckb')

// Image gallery logic
const mainImageIndex = ref(0)
const images = computed(() => {
  const main = props.house.img_url || 'https://via.placeholder.com/400x250?text=No+Image'
  const subs = Array.isArray(props.house.images) ? props.house.images.filter(Boolean) : []
  return [main, ...subs]
})

watch(() => props.house, () => { mainImageIndex.value = 0 })

function setMainImage(idx: number) { mainImageIndex.value = idx }
function nextImage() { if (mainImageIndex.value < images.value.length - 1) mainImageIndex.value++ }
function prevImage() { if (mainImageIndex.value > 0) mainImageIndex.value-- }

/**
 * Close the modal
 */
function closeModal() {
  emit('close')
}

/**
 * Navigate to next house
 */
function nextHouse() {
  emit('navigate', props.currentIndex + 1)
}

/**
 * Navigate to previous house
 */
function prevHouse() {
  emit('navigate', props.currentIndex - 1)
}
</script>

<style scoped>
/**
 * Modal Overlay
 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
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
 * Modal Content
 */
.modal-content {
  background: var(--primary-bg);
  color: var(--primary-text);
  border-radius: 18px;
  box-shadow: 0 8px 40px var(--shadow-medium);
  width: 95vw;
  max-width: 1600px;
  min-width: 320px;
  min-height: 420px;
  max-height: 80vh;
  padding: 2.5rem;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 2.5rem;
  height: 100%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/**
 * Modal Layout
 */
.modal-flex {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  width: 100%;
  height: 100%;
}

/**
 * Details Section
 */
.modal-details {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  position: relative;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-text);
}

.modal-info {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.modal-info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: var(--primary-text);
}

.modal-icon {
  font-size: 1.2rem;
}

.modal-desc {
  color: var(--muted-text);
  font-size: 1rem;
  margin-top: 0.5rem;
  line-height: 1.6;
}

/**
 * Modal Actions
 */
.modal-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 2rem;
}

.modal-btn {
  background: var(--accent-bg);
  color: var(--secondary-text);
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.modal-btn:hover {
  background: var(--primary-text);
  color: var(--primary-bg);
  transform: translateY(-2px);
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.modal-close {
  background: transparent;
  color: var(--primary-text);
  border: 2px solid var(--primary-text);
}

.modal-close:hover {
  background: var(--primary-text);
  color: var(--primary-bg);
}

/**
 * Gallery Section
 */
.modal-gallery {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.modal-main-img {
  width: 100%;
  max-width: 500px;
  max-height: 500px;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1rem;
  background: var(--secondary-bg);
  transition: var(--transition);
}

.modal-main-img:hover {
  transform: scale(1.02);
}

.modal-thumbnails {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.modal-thumb {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border 0.2s;
}
.modal-thumb.active {
  border: 2px solid var(--accent-bg);
}
.thumb-nav {
  background: var(--secondary-bg);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--primary-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.thumb-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/**
 * Responsive Design
 */
@media (max-width: 900px) {
  .modal-content {
    width: 99vw;
    max-width: 99vw;
    min-height: 320px;
    max-height: 85vh;
    padding: 1rem;
  }
  
  .modal-flex {
    gap: 1rem;
  }
  
  .modal-main-img {
    max-width: 100%;
    max-height: 180px;
    height: 140px;
    border-radius: 12px;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-info {
    gap: 1rem;
  }
  
  .modal-info-item {
    font-size: 1rem;
  }
}

@media (max-width: 700px) {
  .modal-content {
    width: 100vw;
    max-width: 100vw;
    min-height: 220px;
    max-height: 90vh;
    padding: 0.5rem;
  }
  
  .modal-flex {
    flex-direction: column-reverse;
    gap: 2rem;
  }
  
  .modal-gallery {
    align-items: center;
  }
  
  .modal-main-img {
    max-width: 100%;
    max-height: 280px;
    height: 280px;
    border-radius: 12px;
    object-fit: contain;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .modal-actions {
    position: relative;
    padding-bottom: 0;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .modal-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  .modal-thumbnails {
    gap: 0.3rem;
    margin-top: 0.5rem;
  }
  .modal-thumb {
    width: 36px;
    height: 36px;
  }
}

/**
 * Accessibility Improvements
 */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay {
    animation: none;
  }
  
  .modal-content {
    animation: none;
  }
  
  .modal-btn {
    transition: none;
  }
  
  .modal-btn:hover {
    transform: none;
  }
  
  .modal-main-img {
    transition: none;
  }
  
  .modal-main-img:hover {
    transform: none;
  }
}
</style> 