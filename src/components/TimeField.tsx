import { defineComponent, ref, PropType, h, computed, watch, nextTick } from 'vue'
import { NRadioGroup, NRadio, NInputNumber, NSpace, NCheckbox, NCheckboxGroup, NButton } from 'naive-ui'
import { Language, locales } from '../locales'

export interface TimeFieldOption {
  label: string
  value: string | number
}

type TimeFieldType = 'every' | 'specific' | 'range' | 'cycle' | 'values'

interface TimeFieldState {
  type: TimeFieldType
  specific: number
  start: number
  end: number
  step: number
  values: (string | number)[]
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

    // Internal state
    const state = ref<TimeFieldState>({
      type: 'every',
      specific: props.min,
      start: props.min,
      end: props.max,
      step: 1,
      values: []
    })

    // Temporary state for storing unconfirmed values
    const tempState = ref<{
      start?: number
      end?: number
      step?: number
    }>({})

    // Internal update flag
    const isInternalUpdate = ref(false)

    // Computed values for input handling
    const computedValues = computed(() => ({
      start: tempState.value.start ?? state.value.start,
      end: tempState.value.end ?? state.value.end,
      step: tempState.value.step ?? state.value.step
    }))

    // Initialize state from external value
    const initializeState = () => {
      if (props.value === '*') {
        state.value = {
          type: 'every',
          specific: props.min,
          start: props.min,
          end: props.max,
          step: 1,
          values: []
        }
        return
      }

      if (props.value.includes('/')) {
        const [start, step] = props.value.split('/')
        state.value = {
          type: 'cycle',
          specific: props.min,
          start: parseInt(start, 10),
          end: props.max,
          step: parseInt(step, 10),
          values: []
        }
        return
      }

      if (props.value.includes('-')) {
        const [start, end] = props.value.split('-')
        state.value = {
          type: 'range',
          specific: props.min,
          start: parseInt(start, 10),
          end: parseInt(end, 10),
          step: 1,
          values: []
        }
        return
      }

      if (props.value.includes(',')) {
        state.value = {
          type: 'values',
          specific: props.min,
          start: props.min,
          end: props.max,
          step: 1,
          values: props.value.split(',').map(v => parseInt(v, 10))
        }
        return
      }

      state.value = {
        type: 'specific',
        specific: parseInt(props.value, 10),
        start: props.min,
        end: props.max,
        step: 1,
        values: []
      }
    }

    // Watch external value changes
    watch(() => props.value, () => {
      if (!isInternalUpdate.value) {
        initializeState()
      }
    }, { immediate: true })

    // Generate cron expression and emit
    const syncToParent = () => {
      let value: string
      switch (state.value.type) {
        case 'every':
          value = '*'
          break
        case 'specific':
          value = state.value.specific.toString().padStart(2, '0')
          break
        case 'range':
          value = `${state.value.start.toString().padStart(2, '0')}-${state.value.end.toString().padStart(2, '0')}`
          break
        case 'cycle':
          value = `${state.value.start.toString().padStart(2, '0')}/${state.value.step}`
          break
        case 'values':
          value = state.value.values.length > 0
            ? state.value.values.map(v => v.toString().padStart(2, '0')).join(',')
            : '*'
          break
        default:
          value = '*'
      }

      if (value !== props.value) {
        isInternalUpdate.value = true
        emit('update:value', value)
        nextTick(() => {
          isInternalUpdate.value = false
        })
      }
    }

    // Handle type change
    const handleTypeChange = (type: TimeFieldType) => {
      state.value.type = type
      tempState.value = {}
      if (type !== 'range' && type !== 'cycle') {
        syncToParent()
      }
    }

    // Handle confirm update
    const handleConfirm = () => {
      if (state.value.type === 'range') {
        const start = tempState.value.start ?? state.value.start
        const end = tempState.value.end ?? state.value.end

        if (start <= end) {
          state.value.start = start
          state.value.end = end
          syncToParent()
        }
      } else if (state.value.type === 'cycle') {
        const start = tempState.value.start ?? state.value.start
        const step = tempState.value.step ?? state.value.step

        if (step > 0) {
          state.value.start = start
          state.value.step = step
          syncToParent()
        }
      }

      tempState.value = {}
    }

    // Handle value update
    const handleValueUpdate = (key: 'specific' | 'start' | 'end' | 'step', val: number | null) => {
      if (val === null || isNaN(val)) {
        return
      }

      if ((state.value.type === 'range' || state.value.type === 'cycle') &&
        (key === 'start' || key === 'end' || key === 'step')) {
        tempState.value[key] = val
        return
      }

      state.value[key] = val
      syncToParent()
    }

    // Handle multiple values update
    const handleValuesUpdate = (vals: (string | number)[]) => {
      state.value.values = vals
      syncToParent()
    }

    return () => h(NSpace, { vertical: true }, {
      default: () => h(NRadioGroup, {
        value: state.value.type,
        'onUpdate:value': handleTypeChange
      }, {
        default: () => h(NSpace, { vertical: true }, {
          default: () => [
            h(NRadio, { value: 'every' }, { default: () => currentLocale.value.options.everyTime }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'specific' }, { default: () => currentLocale.value.options.specificTime }),
                state.value.type === 'specific' && h(NInputNumber, {
                  value: state.value.specific,
                  min: props.min,
                  max: props.max,
                  size: 'small',
                  style: { width: '80px' },
                  'onUpdate:value': (val: number | null) => handleValueUpdate('specific', val)
                })
              ]
            }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'range' }, { default: () => currentLocale.value.options.rangeTime }),
                state.value.type === 'range' && [
                  currentLocale.value.options.fromTime,
                  h(NInputNumber, {
                    value: computedValues.value.start,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleValueUpdate('start', val)
                  }),
                  currentLocale.value.options.toTime,
                  h(NInputNumber, {
                    value: computedValues.value.end,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleValueUpdate('end', val)
                  }),
                  h(NButton, {
                    size: 'small',
                    type: 'primary',
                    onClick: handleConfirm
                  }, { default: () => currentLocale.value.options.confirm })
                ]
              ]
            }),

            h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'cycle' }, { default: () => currentLocale.value.options.intervalTime }),
                state.value.type === 'cycle' && [
                  currentLocale.value.options.startTime,
                  h(NInputNumber, {
                    value: computedValues.value.start,
                    min: props.min,
                    max: props.max,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleValueUpdate('start', val)
                  }),
                  currentLocale.value.options.perTime,
                  h(NInputNumber, {
                    value: computedValues.value.step,
                    min: 1,
                    size: 'small',
                    style: { width: '80px' },
                    'onUpdate:value': (val: number | null) => handleValueUpdate('step', val)
                  }),
                  currentLocale.value.options.unit,
                  h(NButton, {
                    size: 'small',
                    type: 'primary',
                    onClick: handleConfirm
                  }, { default: () => currentLocale.value.options.confirm })
                ]
              ]
            }),

            props.options.length > 0 && h(NSpace, { align: 'center' }, {
              default: () => [
                h(NRadio, { value: 'values' }, { default: () => currentLocale.value.options.multipleTime }),
                state.value.type === 'values' && h(NCheckboxGroup, {
                  value: state.value.values,
                  'onUpdate:value': handleValuesUpdate
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