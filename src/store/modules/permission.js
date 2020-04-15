import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: JSON.parse(window.sessionStorage.getItem('router')) || []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
      window.sessionStorage.setItem('router', JSON.stringify(routers))
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', data)
        resolve()
      })
    }
  }
}
export default permission
