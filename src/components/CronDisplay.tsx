import { defineComponent, h, computed } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
import { Language, locales } from '../locales'

export const CronDisplay = defineComponent({
  name: 'CronDisplay',
  props: {
    value: {
      type: String,
      required: true
    },
    language: {
      type: String as () => Language,
      default: 'en'
    }
  },
  setup(props) {
    const currentLocale = computed(() => locales[props.language])

    const fields = computed(() => [
      { label: currentLocale.value.timeUnits.second, key: 0 },
      { label: currentLocale.value.timeUnits.minute, key: 1 },
      { label: currentLocale.value.timeUnits.hour, key: 2 },
      { label: currentLocale.value.timeUnits.day, key: 3 },
      { label: currentLocale.value.timeUnits.month, key: 4 },
      { label: currentLocale.value.timeUnits.week, key: 5 },
      { label: currentLocale.value.timeUnits.year, key: 6 },
      { label: currentLocale.value.options.cronExpression, key: 7 }
    ])

    const labelStyle = {
      fontSize: '14px',
      textAlign: 'center',
      width: '100%',
      marginBottom: '4px'
    }

    const valueStyle = {
      border: '1px solid #e5e5e5',
      padding: '4px 6px',
      borderRadius: '2px',
      height: '24px',
      textAlign: 'center',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

    return () => {
      const values = props.value.split(' ')

      return h('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' } }, [
        h('div', { style: { flex: '0 0 auto' } }, [
          h(NGrid, { cols: 7, xGap: 3 }, {
            default: () => fields.value.slice(0, 7).map(field =>
              h(NGridItem, { key: field.key }, {
                default: () => [
                  h('div', { style: labelStyle }, field.label),
                  h('div', {
                    style: {
                      ...valueStyle,
                      minWidth: '36px',
                      maxWidth: '36px'
                    }
                  }, values[field.key] || '')
                ]
              })
            )
          })
        ]),
        h('div', {
          style: {
            flex: '1 1 auto'
          }
        }, [
          h('div', { style: labelStyle }, fields.value[7].label),
          h('div', {
            style: {
              ...valueStyle,
              padding: '4px 12px'
            }
          }, props.value)
        ])
      ])
    }
  }
}) 