import cronstrue from 'cronstrue/i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/ja'
import { Language } from '../locales'
import parser from 'cron-parser'

interface CronNextTime {
  time: string
}

const cronLocaleMap: Record<Language, string> = {
  en: 'en',
  zh: 'zh_CN',
  ja: 'ja'
}

// 添加缓存 Map
const nextRunTimeCache = new Map<string, { times: CronNextTime[], timestamp: number }>();
const CACHE_DURATION = 1000 * 60; // 缓存时间1分钟

function isValidYear(yearExp: string): boolean {
  if (yearExp === '*') return true;

  // 处理步长值 2000/2 表示从2000年开始，每隔2年执行一次
  if (yearExp.includes('/')) {
    const [start, step] = yearExp.split('/').map(Number);
    // 确保起始年份和步长都是有效的数字
    if (isNaN(start) || isNaN(step)) return false;
    if (start < 1970) return false; // 确保起始年份合理
    if (step <= 0) return false; // 步长必须大于0
    return true;
  }

  // 处理具体年份
  if (!isNaN(Number(yearExp))) {
    const year = Number(yearExp);
    return year >= 1970; // 确保年份在合理范围内
  }

  // 处理年份列表 2003,2004,2005
  if (yearExp.includes(',')) {
    const years = yearExp.split(',').map(Number);
    return years.every(y => !isNaN(y) && y >= 1970);
  }

  // 处理年份范围 2003-2010
  if (yearExp.includes('-')) {
    const [start, end] = yearExp.split('-').map(Number);
    if (isNaN(start) || isNaN(end)) return false;
    if (start < 1970 || end < 1970) return false;
    return start <= end;
  }

  return false;
}

function matchYear(year: number, yearExp: string): boolean {
  if (yearExp === '*') return true;

  // 处理步长值 2000/2 表示从2000年开始，每隔2年执行一次
  if (yearExp.includes('/')) {
    const [start, step] = yearExp.split('/').map(Number);
    if (year < start) return false;
    return (year - start) % step === 0;
  }

  // 处理具体年份
  if (!isNaN(Number(yearExp))) {
    return year === Number(yearExp);
  }

  // 处理年份列表 2003,2004,2005
  if (yearExp.includes(',')) {
    return yearExp.split(',').map(Number).includes(year);
  }

  // 处理年份范围 2003-2010
  if (yearExp.includes('-')) {
    const [start, end] = yearExp.split('-').map(Number);
    return year >= start && year <= end;
  }

  return false;
}

export function validateCronExpression(cronExpression: string): boolean {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length !== 7) {
      return false;
    }

    const [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;

    // 验证年份格式
    if (!isValidYear(year)) {
      return false;
    }

    // 验证其他字段
    const sixFieldsCron = [second, minute, hour, dayOfMonth, month, dayOfWeek].join(' ');
    parser.parseExpression(sixFieldsCron);
    return true;
  } catch (error) {
    return false;
  }
}

export function getNextRunTimes(cronExpression: string, count = 5, language: Language = 'en'): CronNextTime[] {
  try {
    // 检查缓存
    const cacheKey = `${cronExpression}_${count}_${language}`;
    const now = Date.now();
    const cached = nextRunTimeCache.get(cacheKey);

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('Using cached next run times');
      return cached.times;
    }

    const description = cronstrue.toString(cronExpression, { locale: cronLocaleMap[language] })
    console.log('Cron 表达式描述:', description)

    // 处理 7 段 cron 表达式
    const [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = cronExpression.split(' ');
    // 构建 6 段 cron 表达式（去掉年份）
    const sixFieldsCron = [second, minute, hour, dayOfMonth, month, dayOfWeek].join(' ');

    // 使用 cron-parser 解析表达式
    const interval = parser.parseExpression(sixFieldsCron, {
      currentDate: new Date(),
      iterator: true,
      utc: true
    });

    const nextTimes: CronNextTime[] = [];
    let iterationCount = 0;
    const MAX_ITERATIONS = 1000; // 防止无限循环

    while (nextTimes.length < count && iterationCount < MAX_ITERATIONS) {
      try {
        const next = interval.next();
        if (next.done) break;

        const nextDate = next.value.toDate();
        const nextYear = nextDate.getUTCFullYear();

        // 使用新的年份匹配逻辑
        if (matchYear(nextYear, year)) {
          nextTimes.push({
            time: dayjs(nextDate).format('YYYY-MM-DD HH:mm:ss')
          });
        }

        iterationCount++;
      } catch (e) {
        console.warn('无法获取更多执行时间:', e);
        break;
      }
    }

    // 保存结果到缓存
    nextRunTimeCache.set(cacheKey, { times: nextTimes, timestamp: now });
    return nextTimes;
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