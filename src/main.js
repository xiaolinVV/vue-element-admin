import Vue from 'vue'

// 引入 js-cookie 用于存储 token 等用户信息
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// 引入 element-ui
import Element from 'element-ui'
import './styles/element-variables.scss'

// 引入全局样式
import '@/styles/index.scss' // global css

// 引入全局 APP 视图模板
import App from './App'

// 引入全局 vuex 实例
import store from './store'

// 引入全局路由实例
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

// 引入全局过滤器(可在组件中用于转换文本数据等的函数)
import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// 设置 element-ui 默认尺寸
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 注册全局过滤器(可在组件中用于转换文本数据等的函数)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 设置为 false 以阻止 vue 在启动时生成生产提示.
Vue.config.productionTip = false

// 初始化 vue 全局实例,绑定到 app 视图中,同时绑定路由实例.
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
