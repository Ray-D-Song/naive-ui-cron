import cronstrue from 'cronstrue/i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/ja'
import { Language } from '../locales'

interface CronNextTime {
  time: string
}

const cronLocaleMap: Record<Language, string> = {
  en: 'en',
  zh: 'zh_CN',
  ja: 'ja'
}

export function getNextRunTimes(cronExpression: string, count = 5, language: Language = 'en'): CronNextTime[] {
  try {
    const description = cronstrue.toString(cronExpression, { locale: cronLocaleMap[language] })
    console.log('Cron 表达式描述:', description)

    const nextTimes: CronNextTime[] = []
    let currentTime = dayjs()

    const [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = cronExpression.split(' ')

    for (let i = 0; i < count; i++) {
      // 从当前时间开始，找到下一个匹配的时间
      while (true) {
        // 检查年份
        if (year !== undefined && year !== '*' && !matchCronValue(currentTime.year(), year)) {
          currentTime = currentTime.add(1, 'year').startOf('year')
          continue
        }

        // 检查月份
        if (!matchCronValue(currentTime.month() + 1, month)) {
          currentTime = currentTime.add(1, 'month').startOf('month')
          continue
        }

        // 检查日期（需要同时满足日期和星期的条件）
        const dayMatches = dayOfMonth === '?' || matchCronValue(currentTime.date(), dayOfMonth)
        const weekMatches = dayOfWeek === '?' || matchCronValue(currentTime.day(), dayOfWeek, true)
        if (!dayMatches || !weekMatches) {
          currentTime = currentTime.add(1, 'day').startOf('day')
          continue
        }

        // 检查小时
        if (!matchCronValue(currentTime.hour(), hour)) {
          currentTime = currentTime.add(1, 'hour').startOf('hour')
          continue
        }

        // 检查分钟
        if (!matchCronValue(currentTime.minute(), minute)) {
          currentTime = currentTime.add(1, 'minute').startOf('minute')
          continue
        }

        // 检查秒
        if (!matchCronValue(currentTime.second(), second)) {
          // 如果秒不匹配，直接跳到下一个可能的秒
          if (second === '*') {
            currentTime = currentTime.add(1, 'second')
          } else if (second.includes('/')) {
            const [start, step] = second.split('/')
            const stepNum = Number(step)
            const currentSecond = currentTime.second()
            const nextSecond = Math.ceil((currentSecond + 1) / stepNum) * stepNum
            currentTime = currentTime.second(nextSecond)
          } else if (second.includes('-')) {
            const [start, end] = second.split('-').map(Number)
            const currentSecond = currentTime.second()
            if (currentSecond < start) {
              currentTime = currentTime.second(start)
            } else if (currentSecond > end) {
              currentTime = currentTime.add(1, 'minute').second(start)
            } else {
              currentTime = currentTime.add(1, 'second')
            }
          } else if (second.includes(',')) {
            const values = second.split(',').map(Number).sort((a, b) => a - b)
            const currentSecond = currentTime.second()
            const nextValue = values.find(v => v > currentSecond)
            if (nextValue !== undefined) {
              currentTime = currentTime.second(nextValue)
            } else {
              currentTime = currentTime.add(1, 'minute').second(values[0])
            }
          } else {
            const targetSecond = Number(second)
            if (currentTime.second() < targetSecond) {
              currentTime = currentTime.second(targetSecond)
            } else {
              currentTime = currentTime.add(1, 'minute').second(targetSecond)
            }
          }
          continue
        }

        // 所有条件都满足，找到了下一个时间点
        nextTimes.push({
          time: currentTime.format('YYYY-MM-DD HH:mm:ss')
        })

        // 为下一次迭代准备时间
        if (second === '*') {
          currentTime = currentTime.add(1, 'second')
        } else {
          currentTime = currentTime.add(1, 'minute').second(Number(second))
        }
        break
      }
    }

    return nextTimes
  } catch (error) {
    console.error('解析 cron 表达式错误:', error)
    return []
  }
}

function matchCronValue(current: number, cronValue: string, isWeek = false): boolean {
  // 处理星期的特殊情况
  if (isWeek) {
    // 将 dayjs 的 0(周日) 转换为 7
    current = current === 0 ? 7 : current
  }

  if (cronValue === '*') return true
  if (cronValue === '?') return true

  // 处理列表值 1,2,3
  if (cronValue.includes(',')) {
    return cronValue.split(',').map(Number).includes(current)
  }

  // 处理范围值 1-5
  if (cronValue.includes('-')) {
    const [start, end] = cronValue.split('-').map(Number)
    return current >= start && current <= end
  }

  // 处理步长值 */5 或 5/10
  if (cronValue.includes('/')) {
    const [start, step] = cronValue.split('/')
    const stepNum = Number(step)
    const startNum = start === '*' ? 0 : Number(start)
    return (current - startNum) % stepNum === 0 && current >= startNum
  }

  // 处理具体值
  return Number(cronValue) === current
}

export function validateCronExpression(cronExpression: string): boolean {
  try {
    cronstrue.toString(cronExpression)
    return true
  } catch (error) {
    return false
  }
} 