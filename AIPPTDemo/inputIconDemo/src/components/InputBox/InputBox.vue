<script setup lang="ts">
import ActionButton from '@/components/InputBox/ActionButton.vue'
import IconEarth from '@/components/icons/IconEarth.vue'
import IconTechnology from '@/components/icons/IconTechnology.vue'
import IconPic from '@/components/icons/IconPic.vue'
import IconTranslation from '@/components/icons/IconTranslation.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

const emit = defineEmits<{
  send: []
}>()

const handleSend = () => {
  emit('send')
}
</script>

<template>
  <div class="inputbox__action">
    <ActionButton text="联网搜索" :icon="IconEarth" />

    <ActionButton text="深度思考" :icon="IconTechnology" show-arrow />

    <ActionButton text="AI 生图" :icon="IconPic" show-arrow />

    <ActionButton text="中文" :icon="IconTranslation" show-arrow />

    <div class="action__spacer"></div>

    <button
      type="button"
      aria-disabled="false"
      class="kdv-button kdv-button--light kdv-button--medium is-icon inputbox__send"
      @click="handleSend"
    >
      <span style="display: inline-flex; align-items: center">
        <span class="inputbox__send-text">立即生成</span>
        <span class="kd-icon" style="line-height: 0">
          <IconArrowRight />
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.inputbox__action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px 10px;
  line-height: 24px;
  height: 42px;
}

/* 间距 */
.action__spacer {
  flex: 1;
  min-width: 0;
}

/* 按钮基础样式 */
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

.kdv-button--light:hover:not(.inputbox__send) {
  background-color: rgba(13, 13, 13, 0.06);
}

.kdv-button--large {
  padding: 6px 12px;
  height: 32px;
  font-size: 14px;
  line-height: 20px;
}

.kdv-button--medium {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 20px;
}

.is-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 立即生成按钮 */
.inputbox__send {
  background-color: rgba(131, 80, 242, 1);
  width: 102px;
  height: 32px;
  border-radius: 999px;
  padding: 6px 12px 6px 16px;
  margin-left: 4px;
  color: #fff;
  transition: all 0.2s ease;
}

.kdv-button.inputbox__send:hover {
  background-color: rgba(131, 80, 242, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(131, 80, 242, 0.3);
}

.kdv-button.inputbox__send:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(131, 80, 242, 0.3);
}

.inputbox__send-text {
  font-family:
    PingFang SC,
    sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  vertical-align: middle;
  color: #fff;
  margin-right: 6px;
}

.inputbox__send .kd-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
