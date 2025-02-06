# Naive UI Cron

基于 Naive UI 实现的 cron 表达式编辑器组件。

简体中文 | [English](./README.md)

## 特性

- 🎯 完整的 cron 表达式支持（秒、分、时、日、月、周、年）
- 🌍 国际化支持（英文、中文、日文）
- 🎨 基于 Naive UI 的精美界面
- 📅 下次运行时间预览
- 💡 可视化编辑，实时预览

## 安装

```bash
# npm
npm install naive-ui-cron

# yarn
yarn add naive-ui-cron

# pnpm
pnpm add naive-ui-cron
```

## 使用

```vue
<template>
  <naive-cron v-model="cronExpression" :language="language" />
</template>

<script setup>
import { ref } from 'vue'
import NaiveCron from 'naive-ui-cron'

const cronExpression = ref('* * * * * ? *')
const language = ref('zh') // 'en' | 'zh' | 'ja'
</script>
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | string | '* * * * * ? *' | cron 表达式的值 |
| language | 'en' \| 'zh' \| 'ja' | 'en' | 显示语言 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | (value: string) | 当 cron 表达式变化时触发 |
| change | (value: string) | 当 cron 表达式变化时触发 |

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
cd playground
pnpm dev

# 构建生产版本
pnpm build
```

## 许可证

[MIT](./LICENSE) License © 2024 [Ray-D-Song](https://github.com/Ray-D-Song) 