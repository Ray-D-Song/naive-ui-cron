# Naive UI Cron

A cron expression editor component implemented with Naive UI.

[简体中文](./README.zh-CN.md) | English

## Features

- 🎯 Full cron expression support (seconds, minutes, hours, day, month, week, year)
- 🌍 Internationalization support (English, Chinese, Japanese)
- 🎨 Beautiful UI powered by Naive UI
- 📅 Next run time preview
- 💡 Visual editing with instant preview

## Installation

```bash
# npm
npm install naive-ui-cron

# yarn
yarn add naive-ui-cron

# pnpm
pnpm add naive-ui-cron
```

## Usage

```vue
<template>
  <naive-cron v-model="cronExpression" :language="language" />
</template>

<script setup>
import { ref } from 'vue'
import NaiveCron from 'naive-ui-cron'

const cronExpression = ref('* * * * * ? *')
const language = ref('en') // 'en' | 'zh' | 'ja'
</script>
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| modelValue | string | '* * * * * ? *' | The cron expression value |
| language | 'en' \| 'zh' \| 'ja' | 'en' | The display language |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| update:modelValue | (value: string) | Emitted when the cron expression changes |
| change | (value: string) | Emitted when the cron expression changes |

## Development

```bash
# Install dependencies
pnpm install

# Start development server
cd playground
pnpm dev

# Build for production
pnpm build
```

## License

[MIT](./LICENSE) License © 2024 [Ray-D-Song](https://github.com/Ray-D-Song)
