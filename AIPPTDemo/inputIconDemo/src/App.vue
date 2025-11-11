<script setup lang="ts">
import { ref } from 'vue'
import SmartTextarea from '@/components/SmartTextarea.vue'
import PptSwitch from '@/components/PptSwitch.vue'
import RecommendList from '@/components/Recommend/RecommendList.vue'

const textValue = ref('')
const switchType = ref<'input' | 'upload' | 'paste'>('input')

const handleSwitchChange = (type: 'input' | 'upload' | 'paste') => {
  switchType.value = type
}

const handleRecommendSelect = (text: string) => {
  // 处理推荐项选择
  textValue.value = text
}

const handleRecommendRefresh = () => {
  // 处理刷新推荐列表
  console.log('刷新推荐列表')
}
</script>

<template>
  <div class="container">
    <div class="main-content">
      <div class="aippt-slogan">与 <span class="ai-text">AI 边聊边改</span>，轻松创作 PPT</div>
      <PptSwitch @change="handleSwitchChange" />
      <SmartTextarea v-model="textValue" />
    </div>
    <footer class="footer">
      <RecommendList @select="handleRecommendSelect" @refresh="handleRecommendRefresh" />
    </footer>
  </div>
</template>

<style scoped>
.container {
  width: 780px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 36px;
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
