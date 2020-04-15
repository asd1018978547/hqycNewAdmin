import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (to.path === '/addAdv') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增广告'
          to.meta.title = '新增广告'
        } else {
          to.meta.urlName = '编辑广告'
          to.meta.title = '编辑广告'
        }
      }
      if (to.path === '/sku') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增SKU'
          to.meta.title = '新增SKU'
        } else {
          to.meta.urlName = '编辑SKU'
          to.meta.title = '编辑SKU'
        }
      }
      if (to.path === '/roleadd') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增角色'
          to.meta.title = '新增角色'
        } else {
          to.meta.urlName = '编辑角色'
          to.meta.title = '编辑角色'
        }
      }
      if (to.path === '/addGoods') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增商品'
          to.meta.title = '新增商品'
        } else {
          to.meta.urlName = '编辑商品'
          to.meta.title = '编辑商品'
        }
      }
      if (to.path == '/addRule') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增售后规则'
          to.meta.title = '新增售后规则'
        } else {
          to.meta.urlName = '编辑售后规则'
          to.meta.title = '编辑售后规则'
        }
      }
      if (to.path === '/addActivityArea') {
        if (!to.query.id) {
          to.meta.urlName = '新增活动'
          to.meta.title = '新增活动'
        } else {
          to.meta.urlName = '编辑活动'
          to.meta.title = '编辑活动'
        }
      }
      if (to.path === '/newsInfo') {
        if (parseInt(to.query.id) === -1 || !to.query.id) {
          to.meta.urlName = '新增快报'
          to.meta.title = '新增快报'
        } else {
          to.meta.urlName = '编辑快报'
          to.meta.title = '编辑快报'
        }
      }
      if (to.meta.role) {
        let flag = false
        store.getters.permission_routers.map(item => {
          item.ChildMenu.map(ite => {
            ite.ChildMenu.map(i => {
              if (i.Url == to.path || to.meta.parent == i.RouterName || to.meta.parent == i.Url) { 
                flag = true
              }
              if(to.path === '/refundOrderManageDetail' ) flag = true
            })
          })
        })  
        NProgress.done()
        flag ? next() : next('/main')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
