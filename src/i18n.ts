import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    header: {
      logoAlt: 'AWAT Real Estate',
      themeToggle: 'Toggle theme',
      lang: 'Language',
    },
    houses: {
      featured: 'Featured Houses',
      area: 'Area',
      direction: 'Direction',
      floors: 'Floors',
      price: 'Price',
      viewDetails: 'View Details',
      noHouses: 'No houses found',
      tryAdjust: 'Try adjusting your filters to see more results.',
      loading: 'Loading beautiful houses...',
      errorTitle: 'Oops! Something went wrong',
      tryAgain: 'Try Again',
      loadMore: 'Load More',
    },
    filters: {
      areaRange: 'Area Range',
      anyArea: 'Any Area',
      direction: 'Direction',
      anyDirection: 'Any Direction',
      floors: 'Floors',
      anyFloor: 'Any Floor',
      apply: 'Apply Filters',
      north: 'North',
      south: 'South',
      east: 'East',
      west: 'West',
      northEast: 'North East',
      northWest: 'North West',
      southEast: 'South East',
      southWest: 'South West',
      oneFloor: '1 Floor',
      twoFloors: '2 Floors',
      threeFloors: '3+ Floors',
    },
    loader: {
      title: 'Awat Real Estate',
      subtitle: 'For buying and selling houses and land',
      welcome: 'Welcome to Real Estate',
      loading: 'Loading beautiful properties for you...'
    },
    modal: {
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      floor: 'Floor',
      price: 'Price:',
    },
    hero: {
      title: 'Find Your Dream Home',
      subtitle: 'Discover beautiful houses, apartments, and more. The best place to start your new journey.',
      cta: 'View Houses',
    },
  },
  ckb: {
    header: {
      logoAlt: 'ئاوات - جایداد',
      themeToggle: 'گۆڕینی ڕووناکی/تاریکی',
      lang: 'زمان',
    },
    houses: {
      featured: 'خانووەکان',
      area: 'ڕووبەر',
      direction: 'ئاڕاستە',
      floors: 'ژوورەکان',
      price: 'نرخ',
      viewDetails: 'وردەکاری ببینە',
      noHouses: 'هیچ خانووەکە نەدۆزرایەوە',
      tryAdjust: 'هەوڵبدە فلتەرەکان بگۆڕیت بۆ بینینی دەرئەنجام زیاتر.',
      loading: 'خانووی جوان بار دەکرێت...',
      errorTitle: 'ببورە! هەڵەیەک ڕوویدا',
      tryAgain: 'دووبارە هەوڵبدە',
      loadMore: 'زیاتر بار بکە',
    },
    filters: {
      areaRange: 'مەودای ڕووبەر',
      anyArea: 'هەر ڕووبەرێک',
      direction: 'ئاڕاستە',
      anyDirection: 'هەر ئاڕاستەیەک',
      floors: 'ژوورەکان',
      anyFloor: 'هەر ژوورێک',
      apply: 'فلتەرەکان بەکاربهێنە',
      north: 'باشوور',
      south: 'باشوور',
      east: 'ڕۆژھەڵات',
      west: 'ڕۆژئاوا',
      northEast: 'باشوور ڕۆژھەڵات',
      northWest: 'باشوور ڕۆژئاوا',
      southEast: 'باشوور ڕۆژھەڵات',
      southWest: 'باشوور ڕۆژئاوا',
      oneFloor: '١ ژوور',
      twoFloors: '٢ ژوور',
      threeFloors: '٣+ ژوور',
    },
    loader: {
      title: 'نووسینگەی ئاوات',
      subtitle: 'بۆ کڕین و فرۆشتنی خانوو زەوی',
      welcome: 'بەخێربێیت بۆ جایداد',
      loading: 'خانووی جوان بۆ تۆ بار دەکرێت...'
    },
    modal: {
      close: 'داخستن',
      next: 'دواتر',
      previous: 'پێشتر',
      floor: 'ژوور',
      price: 'نرخ:',
    },
    hero: {
      title: 'خانووی خەونەکانت بدۆزەوە',
      subtitle: 'باشترین شوێن هەڵبژێرە بۆ دەستپێکردنی ژیانێکی نوێ',
      cta: 'بینینی خانووەکان',
    },
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'ckb', // Set ckb as default
  fallbackLocale: 'en',
  messages,
});

export default i18n; 