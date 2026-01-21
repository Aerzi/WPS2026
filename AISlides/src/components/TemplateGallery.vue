<template>
  <div class="template-container">
    <div class="template-filter">
      <div class="filter-title">{{ $t('gallery.title') }}</div>
      <div class="filters">
        <div class="filter-list">
          <div 
            v-for="cat in categories" 
            :key="cat.key"
            :class="['filter-item', { selected: currentCategory === cat.key }]"
            @click="currentCategory = cat.key"
          >
            <span class="name">{{ cat.label }}</span>
            <span v-if="cat.key === 'workReport'" class="hot-label">HOT</span>
          </div>
        </div>
        <div class="more-filters">
          <div class="filter-item more-btn">
            <span>{{ $t('gallery.more') }}</span>
            <span class="arrow">▾</span>
          </div>
        </div>
      </div>
    </div>

    <div class="template-list">
      <TemplateCard 
        v-for="item in templates" 
        :key="item.id"
        :title="item.title"
        :image="item.image"
      />
    </div>
    
    <div class="loading-more">{{ $t('gallery.loading') }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TemplateCard from './TemplateCard.vue'

const { t } = useI18n()
const currentCategory = ref('featured')

const categories = computed(() => [
  { key: 'featured', label: t('gallery.tabs.featured') },
  { key: 'workReport', label: t('gallery.tabs.workReport') },
  { key: 'education', label: t('gallery.tabs.education') },
  { key: 'marketing', label: t('gallery.tabs.marketing') },
  { key: 'company', label: t('gallery.tabs.company') },
  { key: 'higherEdu', label: t('gallery.tabs.higherEdu') }
])

const templates = [
  { id: 1, title: 'Annual Summary & Development Plan', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796625040/6e8c778017a71a6d2270daaa6606f36f.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 2, title: 'Comprehensive Report on Biomedical Industry Research', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796625670/3a59cbea819a948f848314d5f7d7983c.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 3, title: 'Annual Summary And Strategic Development Plan', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796625721/67738f4b282baed115f4216a8da24f64.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 4, title: 'Technology Integration Enabling Industrial Upgrade', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796626161/9d9478115f8a605d8fa32aae28a2a8fe.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 5, title: 'Technology Integration Enabling Industrial Upgrade', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796626331/9adfbeaffae0e6f4b8777c21faaabcfc.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 6, title: 'Marketing Promotion Channel Analysis & Review', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796626450/a04327218a3f3c7b21e4d3ee4d81ecff.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 7, title: 'Annual Business Performance Review and Future Outlook', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796627980/dd1d7407ce827fcb687d00192e1a138e.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 8, title: 'Graduation Thesis Defense Presentation', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796629650/182cf27956bee4004acf8283d6b3ca51.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 9, title: 'Sales Performance Summary', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796630160/92797b96f12dbaa6388697416b2ac874.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' },
  { id: 10, title: 'Corporate Promotion Album', image: 'https://wps-cdn-docer-sg.obs.ap-southeast-3.myhuaweicloud.com/meihua_theme_mb_zt/69796630211/7932f38e0f51a915a3b95da60b759c73.png?x-image-process=image/resize,m_lfit,h_444,w_792/format,webp/marker,u_plus' }
]
</script>

<style scoped>
.template-container {
  margin-top: 20px;
}

.template-filter {
  margin-bottom: 24px;
}

.filter-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.filter-list {
  display: flex;
  gap: 32px;
}

.filter-item {
  padding-bottom: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #718096;
  position: relative;
}

.filter-item.selected {
  color: #333;
  font-weight: 600;
}

.filter-item.selected::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #7453F9;
}

.hot-label {
  position: absolute;
  top: -12px;
  right: -24px;
  background: #f56565;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
}

.more-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #718096;
}

.template-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .template-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .template-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.loading-more {
  text-align: center;
  padding: 40px 0;
  color: #a0aec0;
  font-size: 14px;
}
</style>
