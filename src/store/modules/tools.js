const tools = {
  state: {
    selectOptions: JSON.parse(window.sessionStorage.getItem('selectOptions')) || {}
  },
  mutations: {
    SET_SELECTOPTIONS(state, options) {
      const obj = {}
      options.map(v => {
        if (obj[v.Name]) {
          obj[v.Name].push(v)
        } else if (v.Name !== 'XXXX') {
          obj[v.Name] = []
          obj[v.Name].push(v)
        }
      })
      window.sessionStorage.setItem('selectOptions', JSON.stringify(obj))
      state.selectOptions = obj
    }
  },
  actions: {
    setSelectOptions({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_SELECTOPTIONS', data)
        resolve()
      })
    }
  }
}

export default tools
