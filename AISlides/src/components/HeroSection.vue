<template>
  <section class="hero-section">
    <h1 class="aippt-slogan">
      {{ $t('hero.slogan') }}<span class="gradient-text">{{ $t('hero.sloganHighlight') }}</span>
    </h1>
    
    <div class="ppt-switch">
      <button 
        v-for="mode in modes" 
        :key="mode.id"
        :class="['switch-btn', { active: currentMode === mode.id }]"
        @click="currentMode = mode.id"
      >
        <span class="icon" v-html="mode.icon"></span>
        {{ $t(`hero.${mode.idKey}`) }}
      </button>
    </div>

    <InputArea />
    
    <div class="ppt__recommend">
      <div class="recommend-list">
        <div v-for="tag in translatedTags" :key="tag" class="recommend-button">{{ tag }}</div>
      </div>
      <button class="refresh-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g stroke="#333" stroke-width="1.5">
            <path d="M14.4312 7.03704C13.9659 3.90383 11.2645 1.5 8.00174 1.5C6.09272 1.5 4.65519 2.19334 3.18669 3.63329C2.78027 4.03181 2.25 4.75 2.25 4.75M1.57227 8.96296C2.03759 12.0962 4.73893 14.5 8.00174 14.5C9.91075 14.5 11.3505 13.809 12.8168 12.3667C13.222 11.9682 13.75 11.25 13.75 11.25" stroke-linecap="round" stroke-linejoin="miter" fill="none" vector-effect="non-scaling-stroke"></path>
            <path d="M2 2V4.99C2 4.99552 2.00448 5 2.01 5H5.00075" stroke-linecap="round" stroke-linejoin="miter" fill="none" vector-effect="non-scaling-stroke"></path>
            <path d="M14.0007 14V11.01C14.0007 11.0045 13.9963 11 13.9907 11H11" stroke-linecap="round" stroke-linejoin="miter" fill="none" vector-effect="non-scaling-stroke"></path>
          </g>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputArea from './InputArea.vue'

const { t } = useI18n()
const currentMode = ref('topic')

const modes = [
  { 
    id: 'topic',
    idKey: 'fromTopic',
    label: 'From Topic', 
    icon: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none"><g stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M7.5 7.15385L9.49099 3.01871C9.49462 3.01116 9.50538 3.01116 9.50901 3.01871L11.5 7.15385L14.9832 8.99116C14.9903 8.99491 14.9903 9.00509 14.9832 9.00884L11.5 10.8462L9.50901 14.9813C9.50538 14.9888 9.49462 14.9888 9.49099 14.9813L7.5 10.8462L4.01677 9.00884C4.00966 9.00509 4.00966 8.99491 4.01677 8.99116L7.5 7.15385Z" fill="none" vector-effect="non-scaling-stroke"></path><path d="M2.59091 2.73077L3.49115 1.01685C3.49489 1.00972 3.50511 1.00972 3.50885 1.01685L4.40909 2.73077L5.98138 3.491C5.98891 3.49464 5.98891 3.50536 5.98138 3.509L4.40909 4.26923L3.50885 5.98315C3.50511 5.99028 3.49489 5.99028 3.49115 5.98315L2.59091 4.26923L1.01862 3.509C1.01109 3.50536 1.01109 3.49464 1.01862 3.491L2.59091 2.73077Z" fill="none" vector-effect="non-scaling-stroke"></path></g></svg>`
  },
  { 
    id: 'doc',
    idKey: 'fromDocument',
    label: 'From Document', 
    icon: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none"><g stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M9.79289 1.5H3C2.72386 1.5 2.5 1.72386 2.5 2V14C2.5 14.2761 2.72386 14.5 3 14.5H13C13.2761 14.5 13.5 14.2761 13.5 14V5.20722C13.5 5.07462 13.4473 4.94744 13.3536 4.85368L10.1464 1.64645C10.0527 1.55268 9.9255 1.5 9.79289 1.5Z" stroke-linejoin="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M9.50003 1.5L9.5 5.00004C9.5 5.27618 9.72386 5.50004 10 5.50004H13.5" stroke-linejoin="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M5.5 11.5H10.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke" stroke-linejoin="round"></path></g></svg>`
  },
  { 
    id: 'outline',
    idKey: 'fromOutline',
    label: 'From Outline', 
    icon: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none"><g stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M12.5 2.5H14.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M12.5 7.5H14.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M12.5 12.5H14.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M1.5 2.5H9.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M1.5 7.5H6.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path><path d="M1.5 12.5H9.5" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"></path></g></svg>`
  }
]

const translatedTags = computed(() => [
  t('gallery.tabs.workReport'),
  t('gallery.tabs.education'),
  t('gallery.tabs.marketing'),
  t('gallery.tabs.company')
])
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 60px 0 40px;
}

.aippt-slogan {
  box-sizing: content-box;
  min-height: 48px;
  margin-bottom: 16px;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  font-weight: 700;
  font-family: "PingFang SC", sans-serif;
}

.gradient-text {
  background: linear-gradient(90deg, #9d5ce5, #7453f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ppt-switch {
  display: inline-flex;
  background: #f5f7f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.switch-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.2s;
}

.switch-btn.active {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: #333;
}

.switch-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.switch-btn.active :deep(svg) {
  color: #7453F9;
}

.ppt__recommend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.recommend-list {
  display: flex;
  gap: 12px;
}

.recommend-button {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
}

.recommend-button:hover {
  background: #f7fafc;
}

.refresh-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
</style>
