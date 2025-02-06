export interface CronOption {
  value: string | number
  label: string
}

export interface CronState {
  second: string
  minute: string
  hour: string
  day: string
  month: string
  week: string
  year: string
}

export type TabType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'week' | 'year'
