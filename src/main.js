import { createApp } from 'vue'
import './style.css'
import { router } from './router/index'
import App from './App.vue'
import 'element-plus/theme-chalk/index.css'

// createApp(App).mount('#app')
const app = createApp(App)
app.use(router)
app.mount('#app')
