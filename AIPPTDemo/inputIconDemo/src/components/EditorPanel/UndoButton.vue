<script setup lang="ts">
import starIcon from '@/assets/starPure.svg'
import backIcon from '@/assets/back.svg'
</script>

<template>
  <div class="undo-button">
    <div class="undo-button__star-wrapper">
      <img :src="starIcon" alt="star" class="undo-button__star" />
      <img :src="backIcon" alt="back" class="undo-button__back" />
    </div>
  </div>
</template>

<style scoped>
.undo-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  width: 16px;
  height: 16px;
}

.undo-button__star-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.undo-button__star {
  width: 16px;
  height: 16px;
  object-fit: contain;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
  flex-shrink: 0;
}

.undo-button__back {
  position: absolute;
  width: 8px;
  height: 8px;
  object-fit: contain;
  bottom: -1.5px;
  right: -3.5px;
  pointer-events: none;
  z-index: 1;
}

.undo-button:hover .undo-button__star {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(150, 126, 235, 0.4));
}
</style>
