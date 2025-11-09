<script setup lang="ts">
defineProps<{
  examples: string[]
}>()

const emit = defineEmits<{
  selectExample: [example: string]
  refresh: []
}>()
</script>

<template>
  <div class="examples">
    <button
      v-for="example in examples"
      :key="example"
      class="example-tag"
      @click="emit('selectExample', example)"
    >
      {{ example }}
    </button>
    <button class="refresh-btn" @click="emit('refresh')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M14.25 8C14.25 11.7279 11.7279 14.75 8 14.75C5.27924 14.75 2.93784 13.1641 1.95703 10.875M1.75 8C1.75 4.27208 4.27208 1.25 8 1.25C10.721 1.25 13.0624 2.83598 14.043 5.125M14.25 2.75V5.75H11.25M1.75 13.25V10.25H4.75"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.examples {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.example-tag {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 24px;
  font-size: 13px;
  color: #646a73;
  cursor: pointer;
  transition: all 0.2s;
}

.example-tag:hover {
  background: #f2f5ff;
  border-color: #3370ff;
  color: #3370ff;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f2f3f5;
  border-color: #c9cdd4;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
  color: #646a73;
}
</style>

