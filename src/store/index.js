import "babel-polyfill"
import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import user from './modules/user'
import tools from './modules/tools'
import roleMenu from './modules/roleMenu'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    menu,
    app,
    permission,
    user,
    roleMenu,
    tagsView,
    tools
  },
  getters: {
    sidebar: state => state.app.sidebar,
    permission_routers: state => state.permission.addRouters,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    quickMenu: state => state.tagsView.visitedViews,
    selectOptions: state => state.tools.selectOptions
  }
})

export default store
