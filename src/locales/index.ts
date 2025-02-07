export type Language = 'en' | 'zh' | 'ja'

export interface LocaleConfig {
  timeUnits: {
    second: string
    minute: string
    hour: string
    day: string
    month: string
    week: string
    year: string
  }
  options: {
    everyTime: string
    specificTime: string
    cycleTime: string
    rangeTime: string
    intervalTime: string
    fromTime: string
    toTime: string
    startTime: string
    perTime: string
    multipleTime: string
    cronExpression: string
    nextRunTime: string
    unit: string
    confirm: string
  }
  months: Array<{ label: string; value: number }>
  weeks: Array<{ label: string; value: number }>
  examples: Array<{
    label: string
    value: string
    desc: string
  }>
  messages: {
    invalidExpression: string
    currentExample: string
    examples: string
  }
}

export const locales: Record<Language, LocaleConfig> = {
  en: {
    timeUnits: {
      second: 'Second',
      minute: 'Minute',
      hour: 'Hour',
      day: 'Day',
      month: 'Month',
      week: 'Week',
      year: 'Year'
    },
    options: {
      everyTime: 'Every time unit',
      specificTime: 'Specific time',
      cycleTime: 'Cycle',
      rangeTime: 'Range',
      intervalTime: 'Interval',
      fromTime: 'From',
      toTime: 'To',
      startTime: 'Start at',
      perTime: 'Per',
      multipleTime: 'Multiple values',
      cronExpression: 'Cron Expression',
      nextRunTime: 'Next 5 run times',
      unit: 'unit',
      confirm: 'Confirm'
    },
    months: [
      { label: 'January', value: 1 },
      { label: 'February', value: 2 },
      { label: 'March', value: 3 },
      { label: 'April', value: 4 },
      { label: 'May', value: 5 },
      { label: 'June', value: 6 },
      { label: 'July', value: 7 },
      { label: 'August', value: 8 },
      { label: 'September', value: 9 },
      { label: 'October', value: 10 },
      { label: 'November', value: 11 },
      { label: 'December', value: 12 }
    ],
    weeks: [
      { label: 'Monday', value: 1 },
      { label: 'Tuesday', value: 2 },
      { label: 'Wednesday', value: 3 },
      { label: 'Thursday', value: 4 },
      { label: 'Friday', value: 5 },
      { label: 'Saturday', value: 6 },
      { label: 'Sunday', value: 7 }
    ],
    examples: [
      {
        label: 'Every Second',
        value: '* * * * * ? *',
        desc: 'Execute every second'
      },
      {
        label: 'Every Minute',
        value: '0 * * * * ? *',
        desc: 'Execute at 0 second of every minute'
      },
      {
        label: 'Every Hour',
        value: '0 0 * * * ? *',
        desc: 'Execute at 0 minute 0 second of every hour'
      },
      {
        label: 'Every Day at Midnight',
        value: '0 0 0 * * ? *',
        desc: 'Execute at 00:00:00 every day'
      },
      {
        label: 'Every Monday at Midnight',
        value: '0 0 0 ? * 2 *',
        desc: 'Execute at 00:00:00 every Monday'
      },
      {
        label: 'First Day of Month at Midnight',
        value: '0 0 0 1 * ? *',
        desc: 'Execute at 00:00:00 on the first day of every month'
      },
      {
        label: 'Every Workday at 10 AM',
        value: '0 0 10 ? * 2-6 *',
        desc: 'Execute at 10:00:00 Monday through Friday'
      },
      {
        label: 'Every Year at 1st January at Midnight',
        value: '0 0 0 1 1 ? *',
        desc: 'Execute at 00:00:00 on the 1st January every year'
      }
    ],
    messages: {
      invalidExpression: 'Invalid Cron Expression',
      currentExample: 'Current Example',
      examples: 'Examples'
    }
  },
  zh: {
    timeUnits: {
      second: '秒',
      minute: '分钟',
      hour: '小时',
      day: '日',
      month: '月',
      week: '周',
      year: '年'
    },
    options: {
      everyTime: '每时间点',
      specificTime: '具体时间',
      cycleTime: '周期',
      rangeTime: '范围',
      intervalTime: '间隔',
      fromTime: '从',
      toTime: '至',
      startTime: '开始于',
      perTime: '间隔',
      multipleTime: '指定多个值',
      cronExpression: 'Cron 表达式',
      nextRunTime: '最近5次运行时间',
      unit: '单位',
      confirm: '确认'
    },
    months: [
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
    ],
    weeks: [
      { label: '星期一', value: 1 },
      { label: '星期二', value: 2 },
      { label: '星期三', value: 3 },
      { label: '星期四', value: 4 },
      { label: '星期五', value: 5 },
      { label: '星期六', value: 6 },
      { label: '星期日', value: 7 }
    ],
    examples: [
      {
        label: '每秒执行一次',
        value: '* * * * * ? *',
        desc: '每秒都执行'
      },
      {
        label: '每分钟执行一次',
        value: '0 * * * * ? *',
        desc: '每分钟的第 0 秒执行'
      },
      {
        label: '每小时执行一次',
        value: '0 0 * * * ? *',
        desc: '每小时的第 0 分 0 秒执行'
      },
      {
        label: '每天凌晨执行一次',
        value: '0 0 0 * * ? *',
        desc: '每天的 0 点 0 分 0 秒执行'
      },
      {
        label: '每周一凌晨执行一次',
        value: '0 0 0 ? * 2 *',
        desc: '每周一的 0 点 0 分 0 秒执行'
      },
      {
        label: '每月1号凌晨执行一次',
        value: '0 0 0 1 * ? *',
        desc: '每月 1 号的 0 点 0 分 0 秒执行'
      },
      {
        label: '每年1月1日执行一次',
        value: '0 0 0 1 1 ? *',
        desc: '每年 1 月 1 日的 0 点 0 分 0 秒执行'
      },
      {
        label: '工作日每天上午10点执行一次',
        value: '0 0 10 ? * 2-6 *',
        desc: '周一至周五的上午 10 点 0 分 0 秒执行'
      }
    ],
    messages: {
      invalidExpression: '无法解析 Cron 表达式',
      currentExample: '当前示例说明',
      examples: '示例'
    }
  },
  ja: {
    timeUnits: {
      second: '秒',
      minute: '分',
      hour: '時',
      day: '日',
      month: '月',
      week: '週',
      year: '年'
    },
    options: {
      everyTime: '毎時',
      specificTime: '指定時',
      cycleTime: '周期',
      rangeTime: '範囲',
      intervalTime: '間隔',
      fromTime: 'から',
      toTime: 'まで',
      startTime: 'から',
      perTime: '毎',
      multipleTime: '複数指定',
      cronExpression: 'Cron式',
      nextRunTime: '次回の5回の実行時間',
      unit: '単位',
      confirm: '確認'
    },
    months: [
      { label: '1月', value: 1 },
      { label: '2月', value: 2 },
      { label: '3月', value: 3 },
      { label: '4月', value: 4 },
      { label: '5月', value: 5 },
      { label: '6月', value: 6 },
      { label: '7月', value: 7 },
      { label: '8月', value: 8 },
      { label: '9月', value: 9 },
      { label: '10月', value: 10 },
      { label: '11月', value: 11 },
      { label: '12月', value: 12 }
    ],
    weeks: [
      { label: '月曜日', value: 1 },
      { label: '火曜日', value: 2 },
      { label: '水曜日', value: 3 },
      { label: '木曜日', value: 4 },
      { label: '金曜日', value: 5 },
      { label: '土曜日', value: 6 },
      { label: '日曜日', value: 7 }
    ],
    examples: [
      {
        label: '毎秒実行',
        value: '* * * * * ? *',
        desc: '毎秒実行します'
      },
      {
        label: '毎分実行',
        value: '0 * * * * ? *',
        desc: '毎分の0秒に実行します'
      },
      {
        label: '毎時実行',
        value: '0 0 * * * ? *',
        desc: '毎時の0分0秒に実行します'
      },
      {
        label: '毎日深夜に実行',
        value: '0 0 0 * * ? *',
        desc: '毎日の0時0分0秒に実行します'
      },
      {
        label: '毎週月曜の深夜に実行',
        value: '0 0 0 ? * 2 *',
        desc: '毎週月曜の0時0分0秒に実行します'
      },
      {
        label: '毎月1日の深夜に実行',
        value: '0 0 0 1 * ? *',
        desc: '毎月1日の0時0分0秒に実行します'
      },
      {
        label: '毎年1月1日の深夜に実行',
        value: '0 0 0 1 1 ? *',
        desc: '毎年1月1日の0時0分0秒に実行します'
      },
      {
        label: '平日の午前10時に実行',
        value: '0 0 10 ? * 2-6 *',
        desc: '月曜から金曜の午前10時0分0秒に実行します'
      }
    ],
    messages: {
      invalidExpression: 'Cron式が無効です',
      currentExample: '現在の例の説明',
      examples: '例'
    }
  }
} 