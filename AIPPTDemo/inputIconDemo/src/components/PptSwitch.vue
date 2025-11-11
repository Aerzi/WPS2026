<script setup lang="ts">
import { ref } from 'vue'

type SwitchType = 'input' | 'upload' | 'paste'

const activeType = ref<SwitchType>('input')

const emit = defineEmits<{
  change: [type: SwitchType]
}>()

const handleClick = (type: SwitchType) => {
  activeType.value = type
  emit('change', type)
}
</script>

<template>
  <div class="ppt_switch">
    <button
      type="button"
      :class="[
        'kdv-button',
        'kdv-button--light',
        'kdv-button--large',
        'ppt_switch__btn',
        { 'ppt_switch__btn--active': activeType === 'input' },
      ]"
      @click="handleClick('input')"
    >
      <span>
        <span class="kd-icon kd-icon-star_two ppt_switch__icon" style="line-height: 0">
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
            <g class="kd-color-icon-primary kd-stroke-width-icon-regular">
              <path
                d="M7.5 7.15385L9.49099 3.01871C9.49462 3.01116 9.50538 3.01116 9.50901 3.01871L11.5 7.15385L14.9832 8.99116C14.9903 8.99491 14.9903 9.00509 14.9832 9.00884L11.5 10.8462L9.50901 14.9813C9.50538 14.9888 9.49462 14.9888 9.49099 14.9813L7.5 10.8462L4.01677 9.00884C4.00966 9.00509 4.00966 8.99491 4.01677 8.99116L7.5 7.15385Z"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
              <path
                d="M2.59091 2.73077L3.49115 1.01685C3.49489 1.00972 3.50511 1.00972 3.50885 1.01685L4.40909 2.73077L5.98138 3.491C5.98891 3.49464 5.98891 3.50536 5.98138 3.509L4.40909 4.26923L3.50885 5.98315C3.50511 5.99028 3.49489 5.99028 3.49115 5.98315L2.59091 4.26923L1.01862 3.509C1.01109 3.50536 1.01109 3.49464 1.01862 3.491L2.59091 2.73077Z"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </span>
        输入主题
      </span>
    </button>
    <button
      type="button"
      :class="[
        'kdv-button',
        'kdv-button--light',
        'kdv-button--large',
        'ppt_switch__btn',
        { 'ppt_switch__btn--active': activeType === 'upload' },
      ]"
      @click="handleClick('upload')"
    >
      <span>
        <span class="kd-icon kd-icon-doc_file ppt_switch__icon" style="line-height: 0">
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
            <g class="kd-color-icon-primary kd-stroke-width-icon-regular">
              <path
                d="M9.79289 1.5H3C2.72386 1.5 2.5 1.72386 2.5 2V14C2.5 14.2761 2.72386 14.5 3 14.5H13C13.2761 14.5 13.5 14.2761 13.5 14V5.20722C13.5 5.07462 13.4473 4.94744 13.3536 4.85368L10.1464 1.64645C10.0527 1.55268 9.9255 1.5 9.79289 1.5Z"
                stroke-linejoin="round"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
              <path
                d="M9.50003 1.5L9.5 5.00004C9.5 5.27618 9.72386 5.50004 10 5.50004H13.5"
                stroke-linejoin="round"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
              <path
                d="M5.5 11.5H10.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </span>
        上传文档
      </span>
    </button>
    <button
      type="button"
      :class="[
        'kdv-button',
        'kdv-button--light',
        'kdv-button--large',
        'ppt_switch__btn',
        { 'ppt_switch__btn--active': activeType === 'paste' },
      ]"
      @click="handleClick('paste')"
    >
      <span>
        <span class="kd-icon kd-icon-doc_list_vertical ppt_switch__icon" style="line-height: 0">
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
            <g class="kd-color-icon-blue-primary kd-stroke-width-icon-regular">
              <path
                d="M12.5 2.5H14.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12.5 7.5H14.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12.5 12.5H14.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
            </g>
            <g class="kd-color-icon-primary kd-stroke-width-icon-regular">
              <path
                d="M1.5 2.5H9.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
              <path
                d="M1.5 7.5H6.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
              <path
                d="M1.5 12.5H9.5"
                stroke-linecap="round"
                fill="none"
                vector-effect="non-scaling-stroke"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </span>
        粘贴大纲
      </span>
    </button>
  </div>
</template>

<style scoped>
.ppt_switch {
  width: max-content;
  padding: 4px;
  border-radius: 99px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  gap: 8px;
}

.ppt_switch .ppt_switch__btn {
  padding: 6px 24px;
  height: 34px;
  border-radius: 99px;
  color: rgba(13, 13, 13, 1);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  cursor: pointer;
}

.kdv-button--light:not(.is-disabled, .is-loading):hover {
  background-color: rgba(13, 13, 13, 0.06);
}

.ppt_switch .ppt_switch__btn.ppt_switch__btn--active {
  background: #fff;
  color: rgba(30, 95, 199, 1);
}

.ppt_switch__icon {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.kdv-button {
  border: none;
  outline: none;
  background: transparent;
}

.kdv-button--large {
  padding: 8px 16px;
  font-size: 14px;
}

/* SVG图标样式 */
.kd-stroke-width-icon-regular {
  stroke-width: 1px;
}

.kd-color-icon-primary {
  fill: #333333;
  stroke: #333333;
}

.kd-color-icon-blue-primary {
  fill: #2661bf;
  stroke: #2661bf;
}
</style>
