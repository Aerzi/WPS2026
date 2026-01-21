<template>
  <div class="template-item">
    <div class="recommend-card">
      <div v-if="isPremium" class="corner-badge">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0H24V24H6C2.68629 24 0 21.3137 0 18V0Z" fill="url(#paint0_linear_900_23908)"></path>
          <g clip-path="url(#clip0_900_23908)">
            <path d="M15.9759 5.8667C16.4089 5.8667 16.8151 6.07687 17.065 6.4305L19.3754 9.70029C19.7393 10.2153 19.6928 10.915 19.2637 11.3771L12.977 18.1477C12.4495 18.7158 11.5503 18.7158 11.0228 18.1477L4.73608 11.3771C4.30699 10.915 4.26044 10.2153 4.62436 9.70029L6.93477 6.4305C7.18464 6.07692 7.59062 5.86673 8.02358 5.8667H15.9759Z" fill="white"></path>
            <path d="M11.9999 7.2002L12.9568 9.6722C13.0257 9.8501 13.1642 9.99219 13.3402 10.0656L15.4221 10.9335L13.3402 11.8015C13.1642 11.8749 13.0257 12.017 12.9568 12.1949L11.9999 14.6669L11.0429 12.1949C10.9741 12.017 10.8356 11.8749 10.6595 11.8015L8.57764 10.9335L10.6595 10.0656C10.8356 9.99219 10.9741 9.8501 11.0429 9.6722L11.9999 7.2002Z" fill="#3A62FD"></path>
          </g>
          <defs>
            <linearGradient id="paint0_linear_900_23908" x1="-1.18519" y1="22" x2="26.6265" y2="16.873" gradientUnits="userSpaceOnUse">
              <stop stop-color="#51A0F8"></stop>
              <stop offset="0.141186" stop-color="#4F9CF6"></stop>
              <stop offset="0.464013" stop-color="#2667FF"></stop>
              <stop offset="1" stop-color="#7453F9"></stop>
            </linearGradient>
            <clipPath id="clip0_900_23908">
              <rect width="16" height="16" fill="white" transform="translate(4 4)"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
      <div class="img-container">
        <img :src="image" alt="Template Preview" />
        <div class="hover-btn">{{ $t('card.select') }}</div>
      </div>
      <div class="card-footer">
        <div class="template-name">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  image: String,
  isPremium: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.template-item {
  width: 100%;
}

.recommend-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.recommend-card:hover {
  transform: translateY(-4px);
}

.corner-badge {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.img-container {
  position: relative;
  aspect-ratio: 16/9;
  background: #f5f7f9;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s;
}

.recommend-card:hover .hover-btn {
  opacity: 1;
}

.card-footer {
  padding: 12px 4px;
}

.template-name {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
