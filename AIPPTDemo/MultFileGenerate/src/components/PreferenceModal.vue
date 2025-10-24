<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [preference: string]
}>()

const selectedPreference = ref('polish')

const handleConfirm = () => {
  emit('confirm', selectedPreference.value)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="preference-modal">
      <div class="mask" @click="handleClose"></div>
      <div class="content">
        <span class="close" @click="handleClose">
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke-width="1.5">
            <g stroke="#6B6B6B" fill="#6B6B6B">
              <path
                d="M3 13L13 3M3 3L13 13"
                stroke-linecap="round"
                stroke-linejoin="miter"
                fill="none"
                vector-effect="non-scaling-stroke"
              ></path>
            </g>
          </svg>
        </span>

        <div class="title">选择大纲生成偏好</div>

        <div class="setting">
          <!-- 保持原文 -->
          <div
            class="setting-item"
            :class="{ selected: selectedPreference === 'original' }"
            @click="selectedPreference = 'original'"
          >
            <div class="title">保持原文</div>
            <div class="description">目录不变，正文一字不改</div>
            <svg
              width="103"
              height="113"
              viewBox="0 0 103 113"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="img"
            >
              <rect x="1" y="33" width="56.1728" height="65" rx="4.81481" fill="white"></rect>
              <rect
                x="0.578704"
                y="32.5787"
                width="57.0154"
                height="65.8426"
                rx="5.23611"
                stroke="#0D0D0D"
                stroke-opacity="0.06"
                stroke-width="0.842593"
              ></rect>
              <g opacity="0.7">
                <rect
                  x="8.22266"
                  y="49.0488"
                  width="29.6914"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.22266 56.6725C8.22266 56.0077 8.76157 55.4688 9.42636 55.4688H48.7473C49.4121 55.4688 49.951 56.0077 49.951 56.6725V57.4749C49.951 58.1397 49.4121 58.6786 48.7473 58.6786H9.42636C8.76157 58.6786 8.22266 58.1397 8.22266 57.4749V56.6725Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.22266"
                  y="41.0234"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
              </g>
              <g opacity="0.7">
                <rect
                  x="8.22266"
                  y="73.9258"
                  width="36.5123"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.22266 81.5494C8.22266 80.8846 8.76157 80.3457 9.42636 80.3457H48.7473C49.4121 80.3457 49.951 80.8846 49.951 81.5494V82.3519C49.951 83.0167 49.4121 83.5556 48.7473 83.5556H9.42636C8.76157 83.5556 8.22266 83.0167 8.22266 82.3519V81.5494Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.22266"
                  y="65.9023"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
                <path
                  d="M8.22266 87.9693C8.22266 87.3045 8.76157 86.7656 9.42636 86.7656H33.0992C33.764 86.7656 34.3029 87.3045 34.3029 87.9693V88.7718C34.3029 89.4366 33.764 89.9755 33.0992 89.9755H9.42636C8.76157 89.9755 8.22266 89.4366 8.22266 88.7718V87.9693Z"
                  fill="#F2F2F6"
                ></path>
              </g>
              <g filter="url(#filter0_d_2789_105471)">
                <rect
                  x="21"
                  y="14"
                  width="70"
                  height="85"
                  rx="6"
                  fill="white"
                  shape-rendering="crispEdges"
                ></rect>
                <rect
                  x="20.475"
                  y="13.475"
                  width="71.05"
                  height="86.05"
                  rx="6.525"
                  stroke="#0D0D0D"
                  stroke-opacity="0.06"
                  stroke-width="1.05"
                  shape-rendering="crispEdges"
                ></rect>
                <rect x="30" y="36" width="52" height="4" rx="1.5" fill="#F2F2F6"></rect>
                <path
                  d="M30 45.5C30 44.6716 30.6716 44 31.5 44H66.5C67.3284 44 68 44.6716 68 45.5V46.5C68 47.3284 67.3284 48 66.5 48H31.5C30.6716 48 30 47.3284 30 46.5V45.5Z"
                  fill="#F2F2F6"
                ></path>
                <rect x="30" y="26" width="23" height="6" rx="1.5" fill="#E5E5ED"></rect>
                <rect x="30" y="67" width="52" height="4" rx="1.5" fill="#F2F2F6"></rect>
                <path
                  d="M30 76.5C30 75.6716 30.6716 75 31.5 75H80.5C81.3284 75 82 75.6716 82 76.5V77.5C82 78.3284 81.3284 79 80.5 79H31.5C30.6716 79 30 78.3284 30 77.5V76.5Z"
                  fill="#F2F2F6"
                ></path>
                <rect x="30" y="57" width="23" height="6" rx="1.5" fill="#E5E5ED"></rect>
                <path
                  d="M30 84.5C30 83.6716 30.6716 83 31.5 83H61C61.8284 83 62.5 83.6716 62.5 84.5V85.5C62.5 86.3284 61.8284 87 61 87H31.5C30.6716 87 30 86.3284 30 85.5V84.5Z"
                  fill="#F2F2F6"
                ></path>
              </g>
              <path
                d="M13.9993 21.3648C13.9993 20.8561 14.5929 20.5782 14.9837 20.9039L18.4466 23.7896C18.734 24.0296 18.7342 24.4717 18.4466 24.7115L14.9837 27.5972C14.593 27.9227 13.9997 27.6447 13.9993 27.1363V25.3941C11.9662 25.6467 9.94505 26.3877 8.74932 27.2496C7.56393 28.104 6.74939 28.7496 6.09991 30.6461C6.05523 28.9424 6.67094 27.1499 8.38506 25.7144C9.82696 24.5071 11.7324 23.191 13.9993 22.7779V21.3648Z"
                fill="#80808C"
              ></path>
              <defs>
                <filter
                  id="filter0_d_2789_105471"
                  x="5.9502"
                  y="0.949219"
                  width="96.0996"
                  height="111.102"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dx="-2"></feOffset>
                  <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.416522 0 0 0 0 0.405128 0 0 0 0 0.43703 0 0 0 0.08 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2789_105471"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2789_105471"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="check-box">
              <span v-if="selectedPreference === 'original'" class="kd-icon">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke-width="1.5">
                  <g stroke="#FFF" fill="#FFF">
                    <path
                      d="M2.5 7.38775L6.68824 11.2933C6.81053 11.401 6.99639 11.3913 7.10689 11.2716L13.4215 4.5"
                      stroke-linecap="round"
                      stroke-linejoin="miter"
                      fill="none"
                      vector-effect="non-scaling-stroke"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <!-- 正文润色（推荐） -->
          <div
            class="setting-item selected"
            :class="{ selected: selectedPreference === 'polish' }"
            @click="selectedPreference = 'polish'"
          >
            <div class="corner"><span class="bold">推荐</span></div>
            <div class="title">正文润色</div>
            <div class="description">目录不变，仅润色美化正文</div>
            <svg
              width="103"
              height="112"
              viewBox="0 0 103 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="img"
            >
              <rect
                x="1.66699"
                y="32.5"
                width="56.1728"
                height="65"
                rx="4.81481"
                fill="white"
              ></rect>
              <rect
                x="1.2457"
                y="32.0787"
                width="57.0154"
                height="65.8426"
                rx="5.23611"
                stroke="#0D0D0D"
                stroke-opacity="0.06"
                stroke-width="0.842593"
              ></rect>
              <g opacity="0.7">
                <rect
                  x="8.88867"
                  y="48.5488"
                  width="29.6914"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.88867 56.1725C8.88867 55.5077 9.42759 54.9688 10.0924 54.9688H49.4134C50.0781 54.9688 50.6171 55.5077 50.6171 56.1725V56.9749C50.6171 57.6397 50.0781 58.1786 49.4134 58.1786H10.0924C9.42759 58.1786 8.88867 57.6397 8.88867 56.9749V56.1725Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.88867"
                  y="40.5234"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
              </g>
              <g opacity="0.7">
                <rect
                  x="8.88867"
                  y="73.4258"
                  width="36.5123"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.88867 81.0494C8.88867 80.3846 9.42759 79.8457 10.0924 79.8457H49.4134C50.0781 79.8457 50.6171 80.3846 50.6171 81.0494V81.8519C50.6171 82.5167 50.0781 83.0556 49.4134 83.0556H10.0924C9.42759 83.0556 8.88867 82.5167 8.88867 81.8519V81.0494Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.88867"
                  y="65.4023"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
                <path
                  d="M8.88867 87.4693C8.88867 86.8045 9.42759 86.2656 10.0924 86.2656H33.7652C34.43 86.2656 34.9689 86.8045 34.9689 87.4693V88.2718C34.9689 88.9366 34.43 89.4755 33.7652 89.4755H10.0924C9.42759 89.4755 8.88867 88.9366 8.88867 88.2718V87.4693Z"
                  fill="#F2F2F6"
                ></path>
              </g>
              <g filter="url(#filter0_d_2789_105462)">
                <rect
                  x="21.667"
                  y="13.5"
                  width="70"
                  height="85"
                  rx="6"
                  fill="white"
                  shape-rendering="crispEdges"
                ></rect>
                <rect
                  x="21.142"
                  y="12.975"
                  width="71.05"
                  height="86.05"
                  rx="6.525"
                  stroke="#0D0D0D"
                  stroke-opacity="0.06"
                  stroke-width="1.05"
                  shape-rendering="crispEdges"
                ></rect>
                <rect x="30.667" y="35.5" width="37" height="4" rx="1.5" fill="#B795FF"></rect>
                <path
                  d="M30.667 45C30.667 44.1716 31.3386 43.5 32.167 43.5H81.167C81.9954 43.5 82.667 44.1716 82.667 45V46C82.667 46.8284 81.9954 47.5 81.167 47.5H32.167C31.3386 47.5 30.667 46.8284 30.667 46V45Z"
                  fill="#B795FF"
                ></path>
                <rect x="30.667" y="25.5" width="23" height="6" rx="1.5" fill="#E5E5ED"></rect>
                <rect x="30.667" y="66.5" width="45.5" height="4" rx="1.5" fill="#B795FF"></rect>
                <path
                  d="M30.667 76C30.667 75.1716 31.3386 74.5 32.167 74.5H81.167C81.9954 74.5 82.667 75.1716 82.667 76V77C82.667 77.8284 81.9954 78.5 81.167 78.5H32.167C31.3386 78.5 30.667 77.8284 30.667 77V76Z"
                  fill="#B795FF"
                ></path>
                <rect x="30.667" y="56.5" width="23" height="6" rx="1.5" fill="#E5E5ED"></rect>
                <path
                  d="M30.667 84C30.667 83.1716 31.3386 82.5 32.167 82.5H61.667C62.4954 82.5 63.167 83.1716 63.167 84V85C63.167 85.8284 62.4954 86.5 61.667 86.5H32.167C31.3386 86.5 30.667 85.8284 30.667 85V84Z"
                  fill="#B795FF"
                ></path>
                <path
                  d="M66.167 34.6641C66.167 34.2498 66.5028 33.9141 66.917 33.9141C67.3312 33.9141 67.667 34.2498 67.667 34.6641V40.5097C67.667 40.924 67.3312 41.2597 66.917 41.2597C66.5028 41.2597 66.167 40.924 66.167 40.5097V34.6641Z"
                  fill="#7F45F6"
                ></path>
                <path
                  d="M76.1738 27.3896L77.7051 28.124L76.1738 28.8584L75.3867 30.2871L74.5996 28.8584L73.0674 28.124L74.5996 27.3896L75.3867 25.96L76.1738 27.3896ZM81.8672 23.1592L84.6621 24.3369L81.8672 25.5156L80.6045 28.123L79.3418 25.5156L76.5469 24.3369L79.3418 23.1592L80.6045 20.5508L81.8672 23.1592Z"
                  fill="#7F45F6"
                ></path>
              </g>
              <path
                d="M14.6663 20.8648C14.6663 20.3561 15.2599 20.0782 15.6507 20.4039L19.1136 23.2896C19.4012 23.5295 19.4013 23.9717 19.1136 24.2115L15.6507 27.0972C15.26 27.4226 14.6666 27.1447 14.6663 26.6363V24.8941C12.6333 25.1467 10.6119 25.8878 9.41631 26.7496C8.23104 27.6039 7.41634 28.2497 6.7669 30.1461C6.72222 28.4423 7.33869 26.6499 9.05303 25.2144C10.4948 24.0071 12.3996 22.6911 14.6663 22.2779V20.8648Z"
                fill="#7F45F6"
              ></path>
              <defs>
                <filter
                  id="filter0_d_2789_105462"
                  x="6.61719"
                  y="0.449219"
                  width="96.0996"
                  height="111.102"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dx="-2"></feOffset>
                  <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.416522 0 0 0 0 0.405128 0 0 0 0 0.43703 0 0 0 0.08 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2789_105462"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2789_105462"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="check-box">
              <span v-if="selectedPreference === 'polish'" class="kd-icon">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke-width="1.5">
                  <g stroke="#FFF" fill="#FFF">
                    <path
                      d="M2.5 7.38775L6.68824 11.2933C6.81053 11.401 6.99639 11.3913 7.10689 11.2716L13.4215 4.5"
                      stroke-linecap="round"
                      stroke-linejoin="miter"
                      fill="none"
                      vector-effect="non-scaling-stroke"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <!-- 全文编排 -->
          <div
            class="setting-item"
            :class="{ selected: selectedPreference === 'rewrite' }"
            @click="selectedPreference = 'rewrite'"
          >
            <div class="title">全文编排</div>
            <div class="description">智能构建目录，润色美化正文</div>
            <svg
              width="103"
              height="112"
              viewBox="0 0 103 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="img"
            >
              <rect
                x="1.33398"
                y="32.5"
                width="56.1728"
                height="65"
                rx="4.81481"
                fill="white"
              ></rect>
              <rect
                x="0.912688"
                y="32.0787"
                width="57.0154"
                height="65.8426"
                rx="5.23611"
                stroke="#0D0D0D"
                stroke-opacity="0.06"
                stroke-width="0.842593"
              ></rect>
              <g opacity="0.7">
                <rect
                  x="8.55664"
                  y="48.5488"
                  width="29.6914"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.55664 56.1725C8.55664 55.5077 9.09556 54.9688 9.76034 54.9688H49.0813C49.7461 54.9688 50.285 55.5077 50.285 56.1725V56.9749C50.285 57.6397 49.7461 58.1786 49.0813 58.1786H9.76035C9.09556 58.1786 8.55664 57.6397 8.55664 56.9749V56.1725Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.55664"
                  y="40.5234"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
              </g>
              <g opacity="0.7">
                <rect
                  x="8.55664"
                  y="73.4258"
                  width="36.5123"
                  height="3.20988"
                  rx="1.2037"
                  fill="#F2F2F6"
                ></rect>
                <path
                  d="M8.55664 81.0494C8.55664 80.3846 9.09556 79.8457 9.76034 79.8457H49.0813C49.7461 79.8457 50.285 80.3846 50.285 81.0494V81.8519C50.285 82.5167 49.7461 83.0556 49.0813 83.0556H9.76035C9.09556 83.0556 8.55664 82.5167 8.55664 81.8519V81.0494Z"
                  fill="#F2F2F6"
                ></path>
                <rect
                  x="8.55664"
                  y="65.4023"
                  width="18.4568"
                  height="4.81482"
                  rx="1.2037"
                  fill="#E5E5ED"
                ></rect>
                <path
                  d="M8.55664 87.4693C8.55664 86.8045 9.09556 86.2656 9.76034 86.2656H33.4332C34.098 86.2656 34.6369 86.8045 34.6369 87.4693V88.2718C34.6369 88.9366 34.098 89.4755 33.4332 89.4755H9.76034C9.09556 89.4755 8.55664 88.9366 8.55664 88.2718V87.4693Z"
                  fill="#F2F2F6"
                ></path>
              </g>
              <g filter="url(#filter0_d_2789_105477)">
                <rect
                  x="21.334"
                  y="13.5"
                  width="70"
                  height="85"
                  rx="6"
                  fill="white"
                  shape-rendering="crispEdges"
                ></rect>
                <rect
                  x="20.809"
                  y="12.975"
                  width="71.05"
                  height="86.05"
                  rx="6.525"
                  stroke="#0D0D0D"
                  stroke-opacity="0.06"
                  stroke-width="1.05"
                  shape-rendering="crispEdges"
                ></rect>
                <rect x="30.334" y="36" width="37" height="4" rx="1.5" fill="#B795FF"></rect>
                <rect x="30.334" y="26" width="23" height="6" rx="1.5" fill="#A478FF"></rect>
                <rect x="30.334" y="59" width="52" height="4" rx="1.5" fill="#B795FF"></rect>
                <rect x="30.334" y="49" width="23" height="6" rx="1.5" fill="#A478FF"></rect>
                <rect x="30.334" y="82" width="42" height="4" rx="1.5" fill="#B795FF"></rect>
                <rect x="30.334" y="72" width="23" height="6" rx="1.5" fill="#A478FF"></rect>
                <path
                  d="M65.834 35.1641C65.834 34.7498 66.1698 34.4141 66.584 34.4141C66.9982 34.4141 67.334 34.7498 67.334 35.1641V41.0097C67.334 41.424 66.9982 41.7597 66.584 41.7597C66.1698 41.7597 65.834 41.424 65.834 41.0097V35.1641Z"
                  fill="#7F45F6"
                ></path>
                <path
                  d="M75.8398 27.3896L77.3721 28.124L75.8398 28.8584L75.0537 30.2871L74.2666 28.8584L72.7344 28.124L74.2666 27.3896L75.0537 25.96L75.8398 27.3896ZM81.5342 23.1592L84.3291 24.3369L81.5342 25.5156L80.2715 28.123L79.0088 25.5156L76.2129 24.3369L79.0088 23.1592L80.2715 20.5508L81.5342 23.1592Z"
                  fill="#7F45F6"
                ></path>
              </g>
              <path
                d="M14.3333 20.8648C14.3333 20.3561 14.9269 20.0782 15.3177 20.4039L18.7806 23.2896C19.068 23.5296 19.0682 23.9717 18.7806 24.2115L15.3177 27.0972C14.927 27.4227 14.3336 27.1447 14.3333 26.6363V24.8941C12.3002 25.1467 10.279 25.8877 9.0833 26.7496C7.89791 27.604 7.08337 28.2496 6.43389 30.1461C6.38922 28.4424 7.00493 26.6499 8.71905 25.2144C10.1609 24.0071 12.0664 22.691 14.3333 22.2779V20.8648Z"
                fill="#7F45F6"
              ></path>
              <defs>
                <filter
                  id="filter0_d_2789_105477"
                  x="6.28418"
                  y="0.449219"
                  width="96.0996"
                  height="111.102"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dx="-2"></feOffset>
                  <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.416522 0 0 0 0 0.405128 0 0 0 0 0.43703 0 0 0 0.08 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2789_105477"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2789_105477"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="check-box">
              <span v-if="selectedPreference === 'rewrite'" class="kd-icon">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke-width="1.5">
                  <g stroke="#FFF" fill="#FFF">
                    <path
                      d="M2.5 7.38775L6.68824 11.2933C6.81053 11.401 6.99639 11.3913 7.10689 11.2716L13.4215 4.5"
                      stroke-linecap="round"
                      stroke-linejoin="miter"
                      fill="none"
                      vector-effect="non-scaling-stroke"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="footer">
          <button
            aria-disabled="false"
            type="button"
            class="kdv-button cancel"
            @click="handleClose"
          >
            <span>取消</span>
          </button>
          <button
            aria-disabled="false"
            type="button"
            class="kdv-button confirm"
            @click="handleConfirm"
          >
            <span>生成大纲</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.preference-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 1100px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  line-height: 0;
  border-radius: 6px;
  transition: background 0.2s;
}

.close:hover {
  background: #f2f3f5;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2329;
  margin: 0 0 32px 0;
  text-align: center;
}

.setting {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.setting-item {
  position: relative;
  background: #fff;
  border: 2px solid #dee0e3;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.setting-item:hover {
  border-color: #8f8f8f;
}

.setting-item.selected {
  background: #f5f3ff;
  border-color: #7f45f6;
  box-shadow: 0 2px 8px rgba(127, 69, 246, 0.2);
}

.setting-item .corner {
  position: absolute;
  top: -2px;
  left: -2px;
  background: linear-gradient(135deg, #7f45f6 0%, #b795ff 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px 0 12px 0;
  font-size: 12px;
}

.setting-item .corner .bold {
  font-weight: 600;
}

.setting-item .title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
  margin: 0 0 8px 0;
  text-align: left;
}

.setting-item .description {
  font-size: 13px;
  color: #8f959e;
  margin: 0 0 16px 0;
}

.setting-item .img {
  width: 100%;
  height: auto;
  margin-bottom: 16px;
}

.check-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.check-box .kd-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7f45f6;
  border-radius: 50%;
  font-size: 16px;
  line-height: 0;
}

.setting-item:not(.selected) .check-box::after {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #dee0e3;
  border-radius: 50%;
  display: block;
}

.footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.kdv-button {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 120px;
}

.kdv-button.cancel {
  background: #fff;
  color: #646a73;
  border: 1px solid #dee0e3;
}

.kdv-button.cancel:hover {
  background: #f2f3f5;
}

.kdv-button.confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kdv-button.confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .content,
.modal-leave-active .content {
  transition: transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .content,
.modal-leave-to .content {
  transform: scale(0.95);
}

/* 响应式 */
@media (max-width: 768px) {
  .setting {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 24px;
    width: 95%;
  }
}
</style>
