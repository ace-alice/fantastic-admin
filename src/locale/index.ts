import { createI18n } from 'vue-i18n'

// 导入自定义根语言文件
import rootZhCn from './lang/zh-CN'
import rootZhTw from './lang/zh-TW'
import rootEn from './lang/en-US'
import rootJp from './lang/ja-JP'
import rootId from './lang/id-ID'
import rootKo from './lang/ko-KR'
import rootTh from './lang/th-TH'
import rootVi from './lang/vi-VN'
import { getLocal, setLocal } from '@/utils/storage'
import { GetParam, getCookie } from '@/utils/getCommonInfo'
import { LangCode } from '@/enum'

const messages = {
  'zh-CN': {
    ...rootZhCn,
  },
  'zh-TW': {
    ...rootZhTw,
  },
  'en-US': {
    ...rootEn,
  },
  'th-TH': {
    ...rootTh,
  },
  'in-ID': {
    ...rootId,
  },
  'vi-VN': {
    ...rootVi,
  },
  'ja-JP': {
    ...rootJp,
  },
  'ko-KR': {
    ...rootKo,
  },
}

if (GetParam(window.location.href, 'lang') || getCookie('lang')) {
  const type = GetParam(window.location.href, 'lang')
    ? GetParam(window.location.href, 'lang')
    : getCookie('lang')
      ? getCookie('lang')
      : 1
  setLocal('lang', String(type))
  if (!getLocal('langConfig')?.id) {
    setLocal('langConfig', { id: type })
  }
}

const langId = getLocal('langConfig')?.id || getLocal('lang') || 1
const initLangConfig: { id: number | string; lang: string } = {
  id: langId,
  lang: LangCode[Number(langId)],
}

// 导出语言国际化
export const i18n = createI18n({
  legacy: false,
  locale: initLangConfig.lang,
  fallbackLocale: initLangConfig.lang,
  warnHtmlMessage: 'off',
  messages,
})

export function getLocale() {
  return langId
}
