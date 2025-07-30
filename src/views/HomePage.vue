<template>
  <div class="real-estate-app">
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
      <section class="hero-section">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '../supabase'
import { useThemeStore } from '../stores/theme'
import type { House, HouseFilters, SortOption } from '../types/house'
import ThemeToggle from '../components/ThemeToggle.vue'
import HouseCard from '../components/HouseCard.vue'
import HouseModal from '../components/HouseModal.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import FullscreenLoader from '../components/FullscreenLoader.vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue';

const heroImg = new URL('../assets/img1.jpg', import.meta.url).href
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
const initialLoading = ref(false) // No longer needed since we have LoadingPage
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
    ? new URL('../assets/for black theme.jpeg', import.meta.url).href
    : new URL('../assets/for white theme.png', import.meta.url).href
})

// Fetch houses from Supabase
async function fetchHouses(start = 0, end = pageSize - 1) {
  try {
    loading.value = true
    
    const { data, error: fetchError } = await supabase
      .from('houses')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end)
    
    if (fetchError) {
      console.error('Error fetching houses:', fetchError)
      error.value = 'Failed to load houses'
      return
    }
    
    if (start === 0) {
      houses.value = data || []
    } else {
      houses.value = [...houses.value, ...(data || [])]
    }
    
    if ((data || []).length < pageSize) {
      allLoaded.value = true
    }
    
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Failed to load houses'
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

// Modal functions
function openModal(idx: number) {
  modalIndex.value = idx
  modalVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalVisible.value = false
  document.body.style.overflow = 'auto'
}

function navigateModal(newIdx: number) {
  if (newIdx >= 0 && newIdx < filteredHouses.value.length) {
    modalIndex.value = newIdx
  }
}

// Filter functions
function applyFilters() {
  // Filters are reactive, so this is mainly for UI feedback
  console.log('Filters applied:', filters.value)
}

/**
 * Initialize on mount
 */
onMounted(() => {
  themeStore.initializeTheme()
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
      housesSectionRef.value.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      setTimeout(() => {
        if (filteredHouses.value.length > 0) {
          openModal(0)
        }
      }, 800)
    }
  })
}
</script>

<style scoped>
/* ... (rest of the styles remain the same) */
</style>