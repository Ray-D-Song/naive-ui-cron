import { defineComponent, ref, computed } from 'vue'
import { NMessageProvider, NSpace, NCard, NButton, NDivider, NSelect } from 'naive-ui'
import NaiveCron from '../../src/index'
import { Language, locales } from '../../src/locales'

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' }
]

const App = defineComponent({
  name: 'App',
  setup() {
    const cronValue = ref(locales.en.examples[0].value)
    const language = ref<Language>('en')

    const currentLocale = computed(() => locales[language.value])
    const examples = computed(() => currentLocale.value.examples)

    const handleCronChange = (value: string) => {
      console.log('Cron expression changed:', value)
    }

    const handleGithubClick = () => {
      window.open('https://github.com/Ray-D-Song/naive-ui-cron', '_blank')
    }

    return () => (
      <NMessageProvider>
        <div style={{ padding: '20px' }}>
          <NSpace vertical size="large">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <NSelect
                value={language.value}
                options={languageOptions}
                onUpdateValue={(val: Language) => language.value = val}
                style={{ width: '120px' }}
              />
              <NButton
                text
                style={{ fontSize: '24px' }}
                onClick={handleGithubClick}
              >
                <i class="i-carbon-logo-github" />
              </NButton>
            </div>
            <NCard title={currentLocale.value.messages.examples}>
              <NSpace>
                {examples.value.map(example => (
                  <NButton
                    key={example.value}
                    onClick={() => cronValue.value = example.value}
                    type={cronValue.value === example.value ? 'primary' : 'default'}
                    size="small"
                  >
                    {example.label}
                  </NButton>
                ))}
              </NSpace>
              <NDivider />
              <div style={{ color: '#666', marginBottom: '16px' }}>
                {currentLocale.value.messages.currentExample}：
                {examples.value.find(e => e.value === cronValue.value)?.desc}
              </div>
              <NaiveCron
                v-model={cronValue.value}
                onChange={handleCronChange}
                language={language.value}
              />
            </NCard>
          </NSpace>
        </div>
      </NMessageProvider>
    )
  }
})

export default App 