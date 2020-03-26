import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './cn'
import en from './en'
import { getLocale, saveLocale } from '../utils/localStorage'
// 通过插件的形式挂载
Vue.use(VueI18n)

const messages = {
  // 语言包对应的文本
  cn,
  en
}
// 当前语言包的标识 en标识当前语言是英文
let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new VueI18n({
  locale,
  messages
})

export default i18n
