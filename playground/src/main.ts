import { createApp } from 'vue'
import { NMessageProvider } from 'naive-ui'
import App from './App'
import 'uno.css'

const app = createApp(App)
app.component('NMessageProvider', NMessageProvider)
app.mount('#app') 