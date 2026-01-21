<template>
  <div class="input-container">
    <div class="editor-panel">
      <textarea 
        :placeholder="$t('input.placeholder')"
        class="main-textarea"
      ></textarea>
    </div>
    
    <div class="input-actions">
      <div class="left-actions">
        <button class="action-btn">
          <span class="icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
              <g stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
                <path d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z" fill="none" vector-effect="non-scaling-stroke"></path>
                <path d="M11 8C11 11.5899 9.65685 14.5 8 14.5C6.34315 14.5 5 11.5899 5 8C5 4.41015 6.34315 1.5 8 1.5C9.65685 1.5 11 4.41015 11 8Z" fill="none" vector-effect="non-scaling-stroke"></path>
                <path d="M2 10.5H14" fill="none" vector-effect="non-scaling-stroke"></path>
                <path d="M2 5.5H14" fill="none" vector-effect="non-scaling-stroke"></path>
              </g>
            </svg>
          </span>
          {{ $t('input.search') }}
        </button>
        <button class="action-btn">
          <span class="icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
              <g stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
                <path d="M5.09375 5.09375C1.88359 8.30391 0.582418 12.2074 2.1875 13.8125C3.79257 15.4176 7.69609 14.1164 10.9063 10.9063C14.1164 7.69609 15.4176 3.79257 13.8125 2.1875C12.2074 0.582418 8.30391 1.88359 5.09375 5.09375Z" fill="none" vector-effect="non-scaling-stroke"></path>
                <path d="M10.9063 5.09375C14.1164 8.30391 15.4176 12.2074 13.8125 13.8125C12.2074 15.4176 8.30391 14.1164 5.09375 10.9063C1.88359 7.69609 0.582418 3.79257 2.1875 2.1875C3.79257 0.582418 7.69609 1.88359 10.9063 5.09375Z" fill="none" vector-effect="non-scaling-stroke"></path>
                <circle cx="8" cy="8" r="1.25" fill="currentColor" stroke="none"></circle>
              </g>
            </svg>
          </span>
          {{ $t('input.deepThink') }} 
          <span class="arrow-icon">▾</span>
        </button>
      </div>
      <div class="spacer"></div>
      <button class="generate-btn">
        {{ $t('input.generate') }}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 7.5H15M15 7.5L10.2502 12.5M15 7.5L10.2502 2.5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.editor-panel {
  padding-bottom: 8px;
}

.main-textarea {
  width: 100%;
  height: 60px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  color: #333;
}

.main-textarea::placeholder {
  color: #a0aec0;
}

.input-actions {
  display: flex;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4a5568;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f7fafc;
}

.spacer {
  flex: 1;
}

.generate-btn {
  background: linear-gradient(135deg, #9d5ce5, #7453f9);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.generate-btn:hover {
  opacity: 0.95;
}

.arrow-icon {
  font-size: 10px;
  margin-top: 2px;
}
</style>
