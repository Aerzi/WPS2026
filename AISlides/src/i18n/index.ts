import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
    ja
  }
})

export default i18n

