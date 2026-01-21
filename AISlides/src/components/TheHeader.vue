<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-icon">S</span>
        <span class="logo-text">AI Slides</span>
      </div>
    </div>
    <div class="header-right">
      <nav class="nav">
        <a href="#" class="nav-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 4px;">
            <path d="M12.5 2.5H14.5M12.5 7.5H14.5M12.5 12.5H14.5" stroke="currentColor" stroke-linecap="round"/>
            <path d="M1.5 2.5H9.5M1.5 7.5H6.5M1.5 12.5H9.5" stroke="currentColor" stroke-linecap="round"/>
          </svg>
          {{ $t('header.myCreations') }}
        </a>
      </nav>
      
      <!-- Language Switcher -->
      <div class="lang-switcher">
        <select v-model="$i18n.locale" class="lang-select">
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div class="profile">
        <div class="avatar">wa</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-icon {
  background: linear-gradient(135deg, #9d5ce5, #7453f9);
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.lang-switcher {
  display: flex;
  align-items: center;
}

.lang-select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  background: #f8fafc;
  cursor: pointer;
  outline: none;
}

.lang-select:hover {
  border-color: #9d5ce5;
}

.avatar {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #718096;
  cursor: pointer;
}
</style>
