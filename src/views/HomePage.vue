<template>
  <div class="home">
    <h2>Home Page</h2>
    <p>This is a simple Vue 3 + TypeScript project with Vite.</p>
    <div class="features">
      <div class="feature">
        <h3>Vue 3</h3>
        <p>Composition API and modern reactivity</p>
      </div>
      <div class="feature">
        <h3>TypeScript</h3>
        <p>Type safety and better development experience</p>
      </div>
      <div class="feature">
        <h3>Vite</h3>
        <p>Fast build tool and development server</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this simple home page
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.feature h3 {
  color: #42b883;
  margin-bottom: 10px;
}

.feature p {
  margin: 0;
  font-size: 14px;
}
</style> 