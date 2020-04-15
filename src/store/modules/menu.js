const quick = window.sessionStorage.getItem('quickMenus') || []
const saveQuickMenus = (data) => {
  window.sessionStorage.setItem('quickMenus', JSON.stringify(data))
}
const menu = {
  state: {
    menus: [],
    quickMenus: quick
  },
  getters: {
    // 从menus菜单里获取菜单的名字
    getNameFromMenus(state) {
      return (routerName) => {
        let desc = ''
        if (!routerName) return ''
        state.menus.forEach(item => {
          if (item.RouterName === routerName) {
            desc = item.Item
          }
          if (desc !== '') return
          if (item.ChildMenu && item.ChildMenu.length) {
            item.ChildMenu.forEach(el => {
              if (el.RouterName === routerName) {
                desc = el.Item
              }
              if (desc !== '') return
              if (el.ChildMenu && el.ChildMenu.length) {
                el.ChildMenu.forEach(e3 => {
                  if (e3.RouterName === routerName) {
                    desc = e3.Item
                  }
                })
              }
            })
          }
        })
        return desc
      }
    },
    // 根据routername从quickMenus里取出index
    getIndexFromQuickMenus(state) {
      return (routerName) => {
        let index = -1
        state.quickMenus.forEach((item, i) => {
          if (item.name === routerName) {
            index = i
          }
        })
        return index
      }
    }
  },
  mutations: {
    setQuickMenus(state, obj) {
      // 如果没有，则直接push
      if (!state.quickMenus.some(item => item.name === obj.name)) {
        state.quickMenus.push(obj)
      } else {
        // 如果有，则更新
        // 当刷新页面时，由于menus需要重新请求，此时由于异步的问题，
        // 导致urlName获取不到，所以当urlName为''时，做单独处理
        let i = -1
        state.quickMenus.forEach((item, index) => {
          if (item.name === obj.name) {
            i = index
            // 当menus请求不来，导致urlName找不到时
            if (!obj.urlName) {
              obj.urlName = item.urlName
            }
          }
        })
        if (i > -1) {
          state.quickMenus.splice(i, 1, obj)
        }
      }
      // 存入sessionStorage
      saveQuickMenus(state.quickMenus)
    },
    delQuickMenusByIndex(state, index) {
      state.quickMenus.splice(index, 1)
      saveQuickMenus(state.quickMenus)
    },
    delOtherQuickMenus(state, index) {
      state.quickMenus = state.quickMenus.filter((item, i) => i === index)
      saveQuickMenus(state.quickMenus)
    },
    delAllQuickMenus(state) {
      state.quickMenus = []
      saveQuickMenus(state.quickMenus)
    }
  },
  actions: {
    setMenus({ commit }, arr) {
      commit('setMenus', arr)
    },
    setDictionary({ commit }, arr) {
      commit('setDictionary', arr)
    },
    // 快捷菜单设置
    setQuickMenus({ commit }, objMenu) {
      commit('setQuickMenus', objMenu)
    },
    // 删除单个快捷菜单
    delQuickMenusByIndex({ commit }, index) {
      commit('delQuickMenusByIndex', index)
    },
    // 删除其他快捷菜单
    delOtherQuickMenus({ commit }, index) {
      commit('delOtherQuickMenus', index)
    },
    // 删除全部快捷菜单
    delAllQuickMenus({ commit }) {
      commit('delAllQuickMenus')
    },
    // 根据路由名返回对应的路由信息
    getRouterByRouterName({ state, commit }, routername) {
      return new Promise((resolve, reject) => {
        const r = state.quickMenus.filter(item => item.name === routername)[0]
        if (r) {
          resolve(r)
        } else {
          reject(null)
        }
      })
    }
  }
}

export default menu
