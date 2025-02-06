import { defineComponent, ref, PropType, h, watch, computed } from 'vue'
import { NRadioGroup, NRadio, NInputNumber, NSpace, NSelect, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { Language, locales } from '../locales'

export interface TimeFieldOption {
  label: string
  value: string | number
}

export const TimeField = defineComponent({
  name: 'TimeField',
  props: {
    value: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    options: {
      type: Array as PropType<TimeFieldOption[]>,
      default: () => []
    },
    language: {
      type: String as () => Language,
      default: 'en'
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const currentLocale = computed(() => locales[props.language])

    // 根据 value 初始化类型和值
    const initializeValue = () => {
      if (props.value === '*') {
        type.value = 'every'
      } else if (props.value.includes('/')) {
        type.value = 'cycle'
        const [start, step] = props.value.split('/')
        cycleStart.value = parseInt(start, 10)
        cycleStep.value = parseInt(step, 10)
      } else if (props.value.includes('-')) {
        type.value = 'range'
        const [start, end] = props.value.split('-')
        rangeStart.value = parseInt(start, 10)
        rangeEnd.value = parseInt(end, 10)
      } else if (props.value.includes(',')) {
        type.value = 'values'
        selectedValues.value = props.value.split(',').map(v => parseInt(v, 10))
      } else {
        type.value = 'specific'
        specificValue.value = parseInt(props.value, 10)
      }
    }

    const type = ref('every')
    const specificValue = ref<number>(props.min)
    const rangeStart = ref<number>(props.min)
    const rangeEnd = ref<number>(props.max)
    const cycleStart = ref<number>(props.min)
    const cycleStep = ref<number>(1)
    const selectedValues = ref<(string | number)[]>([])

    // 初始化值
    initializeValue()

    // 监听 value 变化
    watch(() => props.value, () => {
      initializeValue()
    })

    const updateValue = () => {
      let value = '*'
      switch (type.value) {
        case 'specific':
          value = specificValue.value.toString().padStart(2, '0')
          break
        case 'range':
          value = `${rangeStart.value.toString().padStart(2, '0')}-${rangeEnd.value.toString().padStart(2, '0')}`
          break
        case 'cycle':
          value = `${cycleStart.value.toString().padStart(2, '0')}/${cycleStep.value}`
          break
        case 'values':
          value = selectedValues.value.map(v => v.toString().padStart(2, '0')).join(',')
          break
      }
      emit('update:value', value)
    }

    const handleInputNumberUpdate = (ref: any, val: number | null) => {
      if (val !== null) {
        ref.value = val
        updateValue()
      }
    }

    return () => h(NSpace, { vertical: true }, {
      default: () => h(NRadioGroup, {
        value: type.value,
        'onUpdate:value': (val: string) => {
          type.value = val
          // 切换类型时重置对应的值
          switch (val) {
            case 'specific':
              specificValue.value = props.min
              break
            case 'range':
              rangeStart.value = props.min
              rangeEnd.value = props.max
              break
            case 'cycle':
              cycleStart.value = props.min
              cycleStep.value = 1
              break
            case 'values':
              selectedValues.value = []
              break
          }
          updateValue()
        }
      }, {
        default: () => h(NSpace, { vertical: true }, {
          default: () => [
            h(NRadio, { value: 'every' }, { default: () => currentLocale.value.options.everyTime }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'specific' }, { default: () => currentLocale.value.options.specificTime }),
                type.value === 'specific' && h(NInputNumber, {
                  value: specificValue.value,
                  min: props.min,
                  max: props.max,
                  size: 'small',
                  style: { width: '80px' },
                  'onUpdate:value': (val: number | null) => handleInputNumberUpdate(specificValue, val)
                })
              ]
            }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'range' }, { default: () => currentLocale.value.options.cycleTime }),
                type.value === 'range' && [
                  currentLocale.value.options.fromTime,
                  h(NInputNumber, {
                    value: rangeStart.value,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleInputNumberUpdate(rangeStart, val)
                  }),
                  currentLocale.value.options.toTime,
                  h(NInputNumber, {
                    value: rangeEnd.value,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleInputNumberUpdate(rangeEnd, val)
                  })
                ]
              ]
            }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'cycle' }, { default: () => currentLocale.value.options.cycleTime }),
                type.value === 'cycle' && [
                  currentLocale.value.options.startTime,
                  h(NInputNumber, {
                    value: cycleStart.value,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleInputNumberUpdate(cycleStart, val)
                  }),
                  currentLocale.value.options.perTime,
                  h(NInputNumber, {
                    value: cycleStep.value,
                    min: 1,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleInputNumberUpdate(cycleStep, val)
                  }),
                  currentLocale.value.options.unit
                ]
              ]
            }),

            props.options.length > 0 && h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'values' }, { default: () => currentLocale.value.options.multipleTime }),
                type.value === 'values' && h(NCheckboxGroup, {
                  value: selectedValues.value,
                  'onUpdate:value': (val: (string | number)[]) => {
                    selectedValues.value = val
                    updateValue()
                  }
                }, {
                  default: () => h(NSpace, { align: 'center' }, {
                    default: () => props.options.map(option =>
                      h(NCheckbox, {
                        key: option.value,
                        value: option.value,
                        label: option.label
                      })
                    )
                  })
                })
              ]
            })
          ]
        })
      })
    })
  }
}) 