import { TimeFieldOption } from './components/TimeField'

export interface TimeConfig {
  min: number
  max: number
  options?: TimeFieldOption[]
}

export const secondConfig: TimeConfig = {
  min: 0,
  max: 59
}

export const minuteConfig: TimeConfig = {
  min: 0,
  max: 59
}

export const hourConfig: TimeConfig = {
  min: 0,
  max: 23
}

export const dayConfig: TimeConfig = {
  min: 1,
  max: 31
}

export const monthConfig: TimeConfig = {
  min: 1,
  max: 12,
  options: [
    { label: '一月', value: 1 },
    { label: '二月', value: 2 },
    { label: '三月', value: 3 },
    { label: '四月', value: 4 },
    { label: '五月', value: 5 },
    { label: '六月', value: 6 },
    { label: '七月', value: 7 },
    { label: '八月', value: 8 },
    { label: '九月', value: 9 },
    { label: '十月', value: 10 },
    { label: '十一月', value: 11 },
    { label: '十二月', value: 12 }
  ] as TimeFieldOption[]
}

export const weekConfig: TimeConfig = {
  min: 1,
  max: 7,
  options: [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ] as TimeFieldOption[]
}

export const yearConfig: TimeConfig = {
  min: 2000,
  max: 2100
} 