<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import TemplateGallery from './components/TemplateGallery.vue'
</script>

<template>
  <div class="app-wrapper">
    <TheHeader />
    <main class="main-content">
      <HeroSection />
      <TemplateGallery />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fff;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 40px 60px;
  width: 100%;
}
</style>
