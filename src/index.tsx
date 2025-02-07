import { defineComponent, ref, watch, h, computed } from 'vue'
import { NTabs, NTabPane, NCard, NSpace, NDivider, NTimeline, NTimelineItem } from 'naive-ui'
import { TimeField } from './components/TimeField'
import { CronDisplay } from './components/CronDisplay'
import { getNextRunTimes, validateCronExpression } from './utils/cron'
import { Language, locales } from './locales'
import {
  secondConfig,
  minuteConfig,
  hourConfig,
  dayConfig,
  monthConfig,
  weekConfig,
  yearConfig
} from './config'

const NaiveCron = defineComponent({
  name: 'NaiveCron',
  props: {
    modelValue: {
      type: String,
      default: '* * * * * ? *'
    },
    language: {
      type: String as () => Language,
      default: 'en'
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const activeTab = ref('second')
    const cronValue = ref(props.modelValue)
    const cronArr = ref(['*', '*', '*', '*', '*', '?', '*'])
    const nextRunTimes = ref<{ time: string }[]>([])

    // 监听 modelValue 变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== cronValue.value) {
        cronValue.value = newVal
        cronArr.value = newVal.split(' ')
        updateNextRunTimes()
      }
    })

    // 监听 cronArr 变化，更新 cronValue
    watch(cronArr, (newVal) => {
      const newCronValue = newVal.join(' ')
      if (newCronValue !== cronValue.value) {
        cronValue.value = newCronValue
        emit('update:modelValue', newCronValue)
        emit('change', newCronValue)
        updateNextRunTimes()
      }
    }, { deep: true })

    const updateNextRunTimes = () => {
      if (validateCronExpression(cronValue.value)) {
        nextRunTimes.value = getNextRunTimes(cronValue.value, 5, props.language)
      } else {
        nextRunTimes.value = []
      }
    }

    // 初始化下次运行时间
    updateNextRunTimes()

    const tabs = computed(() => [
      { name: locales[props.language].timeUnits.second, key: 'second', index: 0, config: secondConfig },
      { name: locales[props.language].timeUnits.minute, key: 'minute', index: 1, config: minuteConfig },
      { name: locales[props.language].timeUnits.hour, key: 'hour', index: 2, config: hourConfig },
      { name: locales[props.language].timeUnits.day, key: 'day', index: 3, config: dayConfig },
      { name: locales[props.language].timeUnits.month, key: 'month', index: 4, config: { ...monthConfig, options: locales[props.language].months } },
      { name: locales[props.language].timeUnits.week, key: 'week', index: 5, config: { ...weekConfig, options: locales[props.language].weeks } },
      { name: locales[props.language].timeUnits.year, key: 'year', index: 6, config: yearConfig }
    ])

    // 更新某个时间字段的值
    const updateCronValue = (index: number, value: string) => {
      cronArr.value[index] = value
    }

    return () => h(NCard, null, {
      default: () => h(NSpace, { vertical: true }, {
        default: () => [
          h(CronDisplay, {
            value: cronValue.value,
            language: props.language
          }),
          h(NTabs, {
            value: activeTab.value,
            'onUpdate:value': (val: string) => activeTab.value = val
          }, {
            default: () => tabs.value.map(tab => h(NTabPane, {
              key: tab.key,
              name: tab.key,
              tab: tab.name
            }, {
              default: () => h(TimeField, {
                value: cronArr.value[tab.index],
                min: tab.config.min,
                max: tab.config.max,
                options: tab.config.options,
                language: props.language,
                'onUpdate:value': (val: string) => updateCronValue(tab.index, val)
              })
            }))
          }),
          h(NDivider, { titlePlacement: 'left' }, {
            default: () => locales[props.language].options.nextRunTime
          }),
          nextRunTimes.value.length > 0
            ? h(NTimeline, null, {
              default: () => nextRunTimes.value.map((time, index) =>
                h(NTimelineItem, {
                  key: index,
                  type: index === 0 ? 'success' : 'default',
                  title: time.time
                })
              )
            })
            : h('div', { style: { color: '#999' } }, locales[props.language].messages.invalidExpression)
        ]
      })
    })
  }
})

export default NaiveCron
