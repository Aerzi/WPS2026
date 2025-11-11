<script setup lang="ts">
import { ref } from 'vue'

const recommendList = ref([
  '企业员工培训PPT',
  'AI对传统教育的影响',
  '我的家乡介绍PPT',
  '学校安全培训课件',
])

const handleRecommendClick = (text: string) => {
  // 处理推荐项点击事件
  console.log('点击了推荐项:', text)
  // 可以在这里触发事件，让父组件处理
  emit('select', text)
}

const handleRefresh = () => {
  // 处理刷新事件
  console.log('刷新推荐列表')
  emit('refresh')
}

const emit = defineEmits<{
  select: [text: string]
  refresh: []
}>()
</script>

<template>
  <div class="recommend">
    <div class="recommend__list">
      <div
        v-for="(item, index) in recommendList"
        :key="index"
        class="recommend-button"
        @click="handleRecommendClick(item)"
      >
        {{ item }}
      </div>
    </div>
    <button
      type="button"
      aria-disabled="false"
      class="kdv-button kdv-button--light kdv-button--large is-icon recommend__refresh"
      @click="handleRefresh"
    >
      <span class="">
        <span class="kd-icon kd-icon-refresh_two" style="line-height: 0">
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke-width="1.5">
            <g id="group-0" stroke="#333333" fill="#333333">
              <path
                d="M14.4312 7.03704C13.9659 3.90383 11.2645 1.5 8.00174 1.5C6.09272 1.5 4.65519 2.19334 3.18669 3.63329C2.78027 4.03181 2.25 4.75 2.25 4.75M1.57227 8.96296C2.03759 12.0962 4.73893 14.5 8.00174 14.5C9.91075 14.5 11.3505 13.809 12.8168 12.3667C13.222 11.9682 13.75 11.25 13.75 11.25"
                stroke-linecap="round"
                stroke-linejoin="miter"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
              <path
                d="M2 2V4.99C2 4.99552 2.00448 5 2.01 5H5.00075"
                stroke-linecap="round"
                stroke-linejoin="miter"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
              <path
                d="M14.0007 14V11.01C14.0007 11.0045 13.9963 11 13.9907 11H11"
                stroke-linecap="round"
                stroke-linejoin="miter"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
            </g>
          </svg>
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.recommend {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.recommend__list {
  width: 738px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.recommend-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  height: 32px;
  font-size: 14px;
  line-height: 20px;
  border-radius: 999px;
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(13, 13, 13, 1);
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  white-space: nowrap;
}

.recommend-button:hover {
  background-color: rgba(13, 13, 13, 0.06);
  border-color: rgba(0, 0, 0, 0.15);
}

.recommend-button:active {
  background-color: rgba(13, 13, 13, 0.1);
}

.recommend__refresh {
  flex-shrink: 0;
}

.recommend__refresh:hover {
  background-color: rgba(13, 13, 13, 0.06);
}

.recommend__refresh:active {
  background-color: rgba(13, 13, 13, 0.1);
}

.kdv-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
  margin: 0;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.kdv-button--light {
  color: rgba(13, 13, 13, 1);
  background-color: transparent;
  border: 1px solid transparent;
}

.kdv-button--large {
  padding: 6px 12px;
  height: 32px;
  font-size: 14px;
  line-height: 20px;
}

.is-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.kd-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  line-height: 1;
  vertical-align: middle;
  flex-shrink: 0;
}

.kd-icon-refresh_two {
  font-size: 16px;
}
</style>

