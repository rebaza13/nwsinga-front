<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from './supabase'
import { useThemeStore } from './stores/theme'
import type { House, HouseFilters, SortOption } from './types/house'
import ThemeToggle from './components/ThemeToggle.vue'
import HouseCard from './components/HouseCard.vue'
import HouseModal from './components/HouseModal.vue'
import SkeletonCard from './components/SkeletonCard.vue'
import FullscreenLoader from './components/FullscreenLoader.vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue';

const heroImg = new URL('./assets/img1.jpg', import.meta.url).href
const heroImageLoading = ref(true)
function onHeroImageLoad() {
  heroImageLoading.value = false
}

const { t, locale } = useI18n()
const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ckb', label: 'کوردی' }
]

// Set font and direction on language change
function applyLangSettings(lang: string) {
  const body = document.body
  if (lang === 'ckb') {
    body.classList.add('ckb-font')
    body.classList.remove('en-font')
    document.documentElement.setAttribute('dir', 'rtl')
  } else {
    body.classList.add('en-font')
    body.classList.remove('ckb-font')
    document.documentElement.setAttribute('dir', 'ltr')
  }
}

// Save language to localStorage
function saveLang(lang: string) {
  localStorage.setItem('lang', lang)
}

let isInitialMount = true

// Load language from localStorage on startup
onMounted(() => {
  const savedLang = localStorage.getItem('lang')
  if (savedLang && savedLang !== locale.value) {
    locale.value = savedLang
  }
  applyLangSettings(locale.value)
  isInitialMount = false
})

// Watch for language changes
watch(() => locale.value, (lang, oldLang) => {
  saveLang(lang)
  applyLangSettings(lang)
  // Removed window.location.reload() to prevent infinite reloads
})

function toggleLang() {
  locale.value = locale.value === 'en' ? 'ckb' : 'en'
}
function currentLangLabel() {
  return locale.value === 'en' ? 'EN' : 'کوردی'
}

/**
 * Real Estate Home Page
 * Beautiful house listing with Supabase integration
 */

// Theme store
const themeStore = useThemeStore()

// State
const houses = ref<House[]>([])
const loading = ref(true)
const initialLoading = ref(true)
const error = ref('')
const modalVisible = ref(false)
const modalIndex = ref(0)
const progress = ref(0)

const pageSize = 10
const allLoaded = ref(false)

// Filters and sorting
const filters = ref<HouseFilters>({
  areaRange: '',
  direction: '',
  floors: ''
})

// Computed properties
const totalHouses = computed(() => houses.value.length)

const averageArea = computed(() => {
  if (houses.value.length === 0) return 0
  const avg = houses.value.reduce((sum, house) => sum + house.square_m, 0) / houses.value.length
  return Math.round(avg)
})

const totalFloors = computed(() => {
  return houses.value.reduce((sum, house) => sum + house.floor, 0)
})

const filteredHouses = computed(() => {
  let filtered = [...houses.value]
  
  // Apply filters
  if (filters.value.areaRange) {
    const [min, max] = filters.value.areaRange.split('-').map(Number)
    filtered = filtered.filter(house => {
      if (max) {
        return house.square_m >= min && house.square_m <= max
      } else {
        return house.square_m >= min
      }
    })
  }
  
  if (filters.value.direction) {
    filtered = filtered.filter(house => house.direction === filters.value.direction)
  }
  
  if (filters.value.floors) {
    const floors = parseInt(filters.value.floors)
    filtered = filtered.filter(house => house.floor >= floors)
  }
  
  // Sort by newest first (default)
  filtered.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  
  return filtered
})

// Computed logo URL based on theme
const logoUrl = computed(() => {
  return themeStore.isDark 
    ? new URL('./assets/for black theme.jpeg', import.meta.url).href
    : new URL('./assets/for white theme.png', import.meta.url).href
})

/**
 * Fetch houses from Supabase
 */
async function fetchHouses(start = 0, end = pageSize - 1) {
  loading.value = true
  error.value = ''
  try {
    const { data, error: fetchError } = await supabase
      .from('houses')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end)
    if (fetchError) {
      error.value = fetchError.message
    } else if (data) {
      if (start === 0) {
        houses.value = data
      } else {
        houses.value = houses.value.concat(data)
      }
      if (data.length < pageSize) allLoaded.value = true
    }
  } catch (err) {
    error.value = 'Failed to fetch houses. Please try again.'
    console.error('Error fetching houses:', err)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  fetchHouses(houses.value.length, houses.value.length + pageSize - 1)
}

function fetchFirstHouses() {
  fetchHouses(0, pageSize - 1)
}

/**
 * Simulate loading progress
 */
function simulateProgress() {
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    } else {
      clearInterval(interval)
    }
  }, 200)
  
  return interval
}

/**
 * Initialize the page
 */
async function initializePage() {
  // Start progress simulation
  const progressInterval = simulateProgress()

  const start = Date.now()
  // Fetch houses
  await fetchHouses()

  // Complete progress
  progress.value = 100

  // Wait for at least 2 seconds total
  const elapsed = Date.now() - start
  if (elapsed < 2000) {
    await new Promise(resolve => setTimeout(resolve, 2000 - elapsed))
  }

  // Hide initial loader
  initialLoading.value = false

  clearInterval(progressInterval)
}

/**
 * Modal functions
 */
function openModal(idx: number) {
  modalIndex.value = idx
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function navigateModal(newIdx: number) {
  if (newIdx >= 0 && newIdx < houses.value.length) {
    modalIndex.value = newIdx
  }
}

/**
 * Filter functions
 */
function applyFilters() {
  console.log('Filters applied:', filters.value)
}

/**
 * Initialize on mount
 */
onMounted(() => {
  themeStore.initializeTheme()
  initializePage()
  // Initial paginated fetch
  fetchHouses(0, pageSize - 1)
  // Preload hero image as soon as possible
  const img = new window.Image()
  img.src = heroImg
  img.onload = onHeroImageLoad
})

const housesSectionRef = ref<HTMLElement | null>(null)

function scrollToHousesAndOpenFirst() {
  nextTick(() => {
    if (housesSectionRef.value) {
      housesSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Open the modal for the first house after a short delay for smoothness
    setTimeout(() => {
      if (filteredHouses.value.length > 0) {
        openModal(0)
      }
    }, 400)
  })
}
</script>

<template>
  <div id="app">
    <!-- Fullscreen Loader -->
    <FullscreenLoader 
      :visible="initialLoading" 
      :progress="progress"
    />
    
    <!-- Main Content -->
    <div v-show="!initialLoading" class="real-estate-app">
      <!-- Header -->
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="header-logo">
              <img 
                :src="logoUrl" 
                :alt="t('header.logoAlt')" 
                class="logo-image"
              />
            </div>
            <div class="header-actions">
              <button class="icon-btn lang-btn" @click="toggleLang" :aria-label="t('header.lang')">
                <Icon icon="mdi:earth" style="font-size: 1.5rem;" />
              </button>
              <button class="icon-btn theme-btn" @click="themeStore.toggleTheme" :aria-label="t('header.themeToggle')">
                <Icon v-if="themeStore.isDark" icon="mdi:weather-night" style="font-size: 1.5rem;" />
                <Icon v-else icon="mdi:white-balance-sunny" style="font-size: 1.5rem;" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <!-- Hero Section with Animation -->
      <transition name="fade-slide-up">
        <section class="hero-section" v-if="!initialLoading">
          <div class="container hero-container">
            <div class="hero-content" :class="{ 'rtl-hero': locale === 'ckb' }">
              <div class="hero-text">
                <h1 class="hero-title">{{ t('hero.title') }}</h1>
                <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
                <button class="hero-btn" @click="scrollToHousesAndOpenFirst">{{ t('hero.cta') }}</button>
              </div>
              <div class="hero-image">
                <div class="hero-image-wrapper">
                  <img :src="heroImg" alt="Hero" @load="onHeroImageLoad" :class="{ 'is-loading': heroImageLoading }" />
                  <div v-if="heroImageLoading" class="hero-image-skeleton"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition>
      <!-- Filters Section -->
      <!--
      <section class="filters">
        <div class="container">
          <div class="filters__content">
            <div class="filter-group">
              <label class="filter__label">{{ t('filters.areaRange') }}</label>
              <select v-model="filters.areaRange" class="filter__select">
                <option value="">{{ t('filters.anyArea') }}</option>
                <option value="0-200">0 - 200 m²</option>
                <option value="200-300">200 - 300 m²</option>
                <option value="300-400">300 - 400 m²</option>
                <option value="400">400+ m²</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter__label">{{ t('filters.direction') }}</label>
              <select v-model="filters.direction" class="filter__select">
                <option value="">{{ t('filters.anyDirection') }}</option>
                <option value="North">{{ t('filters.north') }}</option>
                <option value="South">{{ t('filters.south') }}</option>
                <option value="East">{{ t('filters.east') }}</option>
                <option value="West">{{ t('filters.west') }}</option>
                <option value="North East">{{ t('filters.northEast') }}</option>
                <option value="North West">{{ t('filters.northWest') }}</option>
                <option value="South East">{{ t('filters.southEast') }}</option>
                <option value="South West">{{ t('filters.southWest') }}</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter__label">{{ t('filters.floors') }}</label>
              <select v-model="filters.floors" class="filter__select">
                <option value="">{{ t('filters.anyFloor') }}</option>
                <option value="1">{{ t('filters.oneFloor') }}</option>
                <option value="2">{{ t('filters.twoFloors') }}</option>
                <option value="3">{{ t('filters.threeFloors') }}</option>
              </select>
            </div>
            <button class="btn btn-primary" @click="applyFilters">
              {{ t('filters.apply') }}
            </button>
          </div>
        </div>
      </section>
      -->
      <!-- Houses Section -->
      <section class="houses" ref="housesSectionRef">
        <div class="container">
          <div class="houses__header">
            <h3 class="houses__title">{{ t('houses.featured') }}</h3>
          </div>
          <!-- Loading State -->
          <div v-if="loading" class="houses__loading">
            <div class="loading-text">{{ t('houses.loading') }}</div>
            <div class="houses__grid">
              <SkeletonCard v-for="n in 6" :key="n" />
            </div>
          </div>
          <!-- Error State -->
          <div v-else-if="error" class="houses__error">
            <div class="error-content">
              <h4>{{ t('houses.errorTitle') }}</h4>
              <p>{{ error }}</p>
              <button class="btn btn-primary" @click="fetchFirstHouses">{{ t('houses.tryAgain') }}</button>
            </div>
          </div>
          <!-- Houses Grid -->
          <div v-else class="houses__grid">
            <HouseCard
              v-for="(house, index) in filteredHouses"
              :key="house.id"
              :house="house"
              :index="index"
              @click="openModal"
            />
          </div>
          <!-- Load More Button -->
          <div v-if="!allLoaded && !loading && filteredHouses.length > 0" class="load-more-container">
            <button class="btn btn-primary" @click="loadMore">{{ t('houses.loadMore') }}</button>
          </div>
          <!-- Empty State -->
          <div v-if="!loading && !error && filteredHouses.length === 0" class="houses__empty">
            <div class="empty-content">
              <h4>{{ t('houses.noHouses') }}</h4>
              <p>{{ t('houses.tryAdjust') }}</p>
            </div>
          </div>
        </div>
      </section>
      <!-- House Modal -->
      <HouseModal
        v-if="modalVisible && houses[modalIndex]"
        :visible="modalVisible"
        :house="houses[modalIndex]"
        :houses="houses"
        :currentIndex="modalIndex"
        @close="closeModal"
        @navigate="navigateModal"
      />
    </div>
    <!-- Hidden Hero Section for Preloading (keeps skeleton/image loading while loader is visible) -->
    <section v-if="initialLoading" style="position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden;">
      <div class="hero-image">
        <div class="hero-image-wrapper">
          <img :src="heroImg" alt="Hero" @load="onHeroImageLoad" :class="{ 'is-loading': heroImageLoading }" />
          <div v-if="heroImageLoading" class="hero-image-skeleton"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/**
 * Real Estate App Styles
 */

.real-estate-app {
  min-height: 100vh;
  background-color: var(--primary-bg);
  animation: fadeIn 0.5s ease-out;
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
 * Header Styles
 */
.app-header {
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 0 0.5rem 0;
  min-height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 54px;
  width: auto;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

/**
 * Filters Section
 */
.filters {
  background-color: var(--secondary-bg);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color);
}

.filters__content {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-text);
}

.filter__select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--primary-bg);
  color: var(--primary-text);
  font-size: 0.9rem;
  min-width: 150px;
  transition: all 0.3s ease;
}

.filter__select:focus {
  outline: none;
  border-color: var(--accent-bg);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--accent-bg);
  color: var(--secondary-text);
}

.btn-primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
}

/**
 * Houses Section
 */
.houses {
  padding: 3rem 0;

}

.houses__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.houses__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-text);
  margin: 0;
}

.houses__stats {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.stat-item {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--muted-text);
  padding: 0.5rem 1rem;
  background-color: var(--secondary-bg);
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.houses__grid {

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/**
 * Loading State
 */
.houses__loading {
  text-align: center;
}

.loading-text {
  font-size: 1.1rem;
  color: var(--muted-text);
  margin-bottom: 2rem;
}

/**
 * Error State
 */
.houses__error {
  text-align: center;
  padding: 3rem 0;
}

.error-content h4 {
  font-size: 1.5rem;
  color: var(--primary-text);
  margin-bottom: 1rem;
}

.error-content p {
  color: var(--muted-text);
  margin-bottom: 2rem;
}

/**
 * Empty State
 */
.houses__empty {
  text-align: center;
  padding: 3rem 0;
}

.empty-content h4 {
  font-size: 1.5rem;
  color: var(--primary-text);
  margin-bottom: 1rem;
}

.empty-content p {
  color: var(--muted-text);
}

/**
 * Responsive Design
 */
@media (max-width: 768px) {
  .filters__content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .houses__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .houses__stats {
    justify-content: center;
    gap: 1rem;
  }
  
  .houses__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .houses__title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .filters {
    display: none !important;
  }
  .hero-section, .hero-text {
    text-align: center;
  }
  .hero-btn {
    display: block;
    margin: 0.7rem auto 0 auto;
  }
  .hero-image, .hero-image-wrapper {
    margin: 0 auto;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .houses__grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .filters {
    padding: 1.5rem 0;
  }
  
  .houses {
    padding: 2rem 0;
  }
  
  .houses__title {
    font-size: 1.75rem;
  }
  
  .houses__stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

/**
 * Accessibility Improvements
 */
@media (prefers-reduced-motion: reduce) {
  .real-estate-app {
    animation: none;
  }
  
  .logo-image:hover {
    transform: none;
  }
  
  .btn-primary:hover {
    transform: none;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--secondary-bg);
  border: 1.5px solid var(--border-color);
  color: var(--primary-text);
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  outline: none;
}
.icon-btn:hover, .icon-btn:focus {
  background: var(--hover-bg);
  border-color: var(--primary-text);
  color: var(--accent-bg);
}
.lang-btn {
  /* Additional styles if needed */
}
.theme-btn {
  /* Additional styles if needed */
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0 1rem 0;
}

.hero-section {
  background: var(--primary-bg);
  padding: 3rem 0 2rem 0;
  margin-top: 2rem;
}
.hero-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}
.hero-text {
  flex: 1 1 350px;
  max-width: 500px;
}
.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-text);
  margin-bottom: 1.2rem;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: 1.1rem;
  color: var(--muted-text);
  margin-bottom: 2rem;
}
.hero-btn {
  background: var(--accent-bg);
  color: var(--secondary-text);
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  box-shadow: 0 4px 16px rgba(var(--accent-rgb), 0.12);
}
.hero-btn:hover {
  background: var(--accent-hover);
  color: var(--primary-bg);
  transform: translateY(-2px) scale(1.03);
}
.hero-image {
  /* Ensure the image container doesn't collapse */
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}
.hero-image-wrapper img.is-loading {
  visibility: hidden;
}
.hero-image-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--secondary-bg) 25%, var(--border-color) 50%, var(--secondary-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
  z-index: 1;
}
@media (max-width: 768px) {
  .hero-image, .hero-image-wrapper {
    min-height: 200px;
    height: 200px;
  }
}
@media (max-width: 480px) {
  .hero-image, .hero-image-wrapper {
    min-height: 140px;
    height: 140px;
  }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Animations */
.fade-slide-up-enter-active {
  animation: fadeSlideUp 1s cubic-bezier(0.23, 1, 0.32, 1);
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
</style>
