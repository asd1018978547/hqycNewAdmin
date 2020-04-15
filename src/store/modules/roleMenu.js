const roleMenu = {
  state: {
    menu: JSON.parse(window.localStorage.getItem('roleMenu')) || []
  },
  getters: {
    getMenuForId: (state) => (ItemId) => {
      if (!ItemId) return ''
      let obj = null
      state.menu.forEach(item_1 => {
        if (item_1.Url === ItemId) {
          obj = item_1.MenuFunction
          return false
        }
        item_1.ChildMenu.forEach(item_2 => {
          if (item_2.Url === ItemId) {
            obj = item_2.MenuFunction
            return false
          }
          item_2.ChildMenu.forEach(item_3 => {
            if (item_3.Url === ItemId) {
              obj = item_3.MenuFunction
              return false
            }
            item_3.ChildMenu.forEach(item_4 => {
              if (item_4.Url === ItemId) {
                obj = item_4.MenuFunction
                return false
              }
            })
          })
        })
      })
      return obj
    }
  },
  mutations: {
    SET_MENU: (state, menu) => {
      state.menu = menu
      window.localStorage.setItem('roleMenu', JSON.stringify(menu))
    }
  },
  actions: {
    setMenus({ commit }, arr) {
      commit('SET_MENU', arr)
    }
  }
}

export default roleMenu
