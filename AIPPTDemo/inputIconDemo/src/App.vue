<script setup lang="ts">
import { ref } from 'vue'
import SmartTextarea from '@/components/SmartTextarea.vue'
import PptSwitch from '@/components/PptSwitch.vue'

const textValue = ref('')
const switchType = ref<'input' | 'upload' | 'paste'>('input')

const handleSwitchChange = (type: 'input' | 'upload' | 'paste') => {
  switchType.value = type
}
</script>

<template>
  <div class="container">
    <div class="aippt-slogan">与 <span class="ai-text">AI 边聊边改</span>，轻松创作 PPT</div>
    <PptSwitch @change="handleSwitchChange" />
    <SmartTextarea v-model="textValue" />
  </div>
</template>

<style scoped>
.container {
  width: 780px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.aippt-slogan {
  box-sizing: content-box;
  height: 48px;
  margin-bottom: 16px;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  font-weight: 700;
  font-family:
    PingFang SC,
    sans-serif;
}

.aippt-slogan .ai-text {
  background: linear-gradient(to right, #ff4eb2, #5215db, #7341e2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
