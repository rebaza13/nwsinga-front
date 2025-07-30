<template>
  <div class="house-card" @click="$emit('click', index)" v-intersect="onIntersect" :class="{ 'animated': animated }">
    <!-- Card Image Section -->
    <div class="house-card__image">
      <img 
        :src="house.img_url || 'https://via.placeholder.com/400x250?text=No+Image'" 
        :alt="house.title" 
        class="house-card__img"
        loading="lazy"
      />
      <!-- House features overlay -->
      <div class="house-card__overlay">
        <div class="house-card__features">
          <span class="feature">
            <span class="feature__icon">📏</span>
            {{ house.square_m }} m²
          </span>
          <span class="feature">
            <span class="feature__icon">🏠</span>
            {{ house.floor }} floor{{ house.floor > 1 ? 's' : '' }}
          </span>
          <span class="feature">
            <span class="feature__icon">🧭</span>
            {{ house.direction }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Card Content Section -->
    <div class="house-card__content">
      <h3 class="house-card__title">{{ house.title }}</h3>
      <p class="house-card__description">{{ house.description }}</p>
      
      <!-- House Details -->
      <div class="house-card__details">
        <div class="detail">
          <span class="detail__label">Area:</span>
          <span class="detail__value">{{ house.square_m }} m²</span>
        </div>
        <div class="detail">
          <span class="detail__label">Direction:</span>
          <span class="detail__value">{{ house.direction }}</span>
        </div>
        <div class="detail">
          <span class="detail__label">Floors:</span>
          <span class="detail__value">{{ house.floor }}</span>
        </div>
        <div class="detail">
          <span class="detail__label">Price:</span>
          <span class="detail__value">{{ formatPrice(house.price) }}</span>
        </div>
      </div>
      
      <!-- Action Button -->
      <button class="btn btn-primary house-card__button">
        {{ t('houses.viewDetails') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HouseCardProps } from '../types/house'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { formatPrice } from '../utils/formatters'

/**
 * House Card Component
 * Displays a house in a beautiful card format with hover effects
 */

// Define component props
const props = defineProps<HouseCardProps>()

// Define component events
const emit = defineEmits<{
  click: [index: number]
}>()

const { t } = useI18n()

// Animation logic
const animated = ref(false)
function onIntersect(entries: IntersectionObserverEntry[]) {
  if (entries[0].isIntersecting) {
    animated.value = true
  }
}
</script>

<style scoped>
/**
 * House Card Styles
 * Beautiful card design with hover effects and responsive layout
 */
.house-card {
  background-color: var(--primary-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 0;
  transform: translateY(40px);
}

.house-card:hover {
  border-color: var(--primary-text);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--shadow-medium);
}

.house-card.animated {
  animation: fadeSlideUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Card Image Section
 */
.house-card__image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.house-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.house-card:hover .house-card__img {
  transform: scale(1.05);
}

.house-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1rem;
  opacity: 0;
  transition: var(--transition);
}

.house-card:hover .house-card__overlay {
  opacity: 1;
}

.house-card__features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.feature__icon {
  font-size: 1rem;
}

/**
 * Card Content Section
 */
.house-card__content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.house-card__title {
  color: var(--primary-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.house-card__description {
  color: var(--muted-text);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/**
 * House Details
 */
.house-card__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail__label {
  font-size: 0.8rem;
  color: var(--muted-text);
  font-weight: 500;
}

.detail__value {
  font-size: 0.9rem;
  color: var(--primary-text);
  font-weight: 600;
}

/**
 * Action Button
 */
.house-card__button {
  width: 100%;
  margin-top: auto;
}

/**
 * Responsive Design
 */
@media (max-width: 768px) {
  .house-card__image {
    height: 200px;
  }
  
  .house-card__content {
    padding: 1.25rem;
  }
  
  .house-card__title {
    font-size: 1.1rem;
  }
  
  .house-card__description {
    font-size: 0.9rem;
  }
  
  .house-card__details {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .house-card__image {
    height: 180px;
  }
  
  .house-card__content {

    padding: 1rem;
  }
  
  .house-card__title {
    font-size: 1rem;
  }
  
  .house-card__description {
    font-size: 0.85rem;
  }
  .house-card__details {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .detail {
    flex: 1 1 45%;
    min-width: 120px;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
  }
}

/**
 * Accessibility Improvements
 */
@media (prefers-reduced-motion: reduce) {
  .house-card {
    transition: none;
  }
  
  .house-card:hover {
    transform: none;
  }
  
  .house-card__img {
    transition: none;
  }
  
  .house-card:hover .house-card__img {
    transform: none;
  }
  
  .house-card__overlay {
    transition: none;
  }
}
</style> 
