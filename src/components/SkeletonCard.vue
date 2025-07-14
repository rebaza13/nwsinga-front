<template>
  <div class="skeleton-card">
    <!-- Skeleton Image -->
    <div class="skeleton-image"></div>
    
    <!-- Skeleton Content -->
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-description">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-line--short"></div>
      </div>
      
      <!-- Skeleton Details -->
      <div class="skeleton-details">
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
      </div>
      
      <!-- Skeleton Button -->
      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Skeleton Card Component
 * Shows loading placeholders while content is being fetched
 */
</script>

<style scoped>
/**
 * Skeleton Card Styles
 * Beautiful loading animation with pulse effect
 */
.skeleton-card {
  background-color: var(--primary-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/**
 * Skeleton Image
 */
.skeleton-image {
  height: 250px;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/**
 * Skeleton Content
 */
.skeleton-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/**
 * Skeleton Title
 */
.skeleton-title {
  height: 1.5rem;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  width: 80%;
}

/**
 * Skeleton Description
 */
.skeleton-description {
  margin-bottom: 1.5rem;
  flex: 1;
}

.skeleton-line {
  height: 0.9rem;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-line--short {
  width: 60%;
}

/**
 * Skeleton Details
 */
.skeleton-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.skeleton-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skeleton-label {
  height: 0.7rem;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 60%;
}

.skeleton-value {
  height: 0.9rem;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 80%;
}

/**
 * Skeleton Button
 */
.skeleton-button {
  height: 2.5rem;
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 25%,
    var(--border-color) 50%,
    var(--secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-top: auto;
}

/**
 * Shimmer Animation
 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/**
 * Responsive Design
 */
@media (max-width: 768px) {
  .skeleton-image {
    height: 200px;
  }
  
  .skeleton-content {
    padding: 1.25rem;
  }
  
  .skeleton-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .skeleton-image {
    height: 180px;
  }
  
  .skeleton-content {
    padding: 1rem;
  }
}

/**
 * Accessibility Improvements
 */
@media (prefers-reduced-motion: reduce) {
  .skeleton-image,
  .skeleton-title,
  .skeleton-line,
  .skeleton-label,
  .skeleton-value,
  .skeleton-button {
    animation: none;
    background: var(--secondary-bg);
  }
}
</style> 