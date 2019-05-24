import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 全局前置守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar
  // 开启loading
  NProgress.start()

  // set page title
  // 设置标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 获取登录 token
  const hasToken = getToken()

  // 判断 token 是否存在
  if (hasToken) {
    // 如果 token 已存在并且目标路由是登录页
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      // 直接定向到首页,即自动登录
      next({ path: '/' })
      // 取消 loading
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 如果 token 已存在并且目标路由不是登录页,则需判断是否有权限跳转
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 有权限  直接跳转
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
