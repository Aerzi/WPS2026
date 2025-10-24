<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const charts = [
  { path: '/timeline', name: '时间轴图表' },
  { path: '/pentagon', name: '五段式环形图' },
  { path: '/gantt', name: '甘特图' },
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div id="app-container">
    <!-- 导航栏 -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="nav-brand">图表大师</div>
        <div class="nav-links">
          <a
            v-for="chart in charts"
            :key="chart.path"
            @click="navigateTo(chart.path)"
            class="nav-link"
          >
            {{ chart.name }}
          </a>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}

#app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.nav-bar {
  width: 100%;
  background: linear-gradient(135deg, #2a4a6a 0%, #3a5a7a 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  flex-shrink: 0;
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav-brand {
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-link:active {
  transform: translateY(0);
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
</style>
