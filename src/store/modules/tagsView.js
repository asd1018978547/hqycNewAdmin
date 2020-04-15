const quick = JSON.parse(window.sessionStorage.getItem('quickMenu')) || [{
  name: 'main',
  path: '/main',
  title: '首页'
}]
const tagsView = {
  state: {
    visitedViews: quick
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) {
        state.visitedViews.map(item => {
          if (item.path === view.path) {
            item.name = view.name
            item.path = view.path
            item.title = view.meta.title
            item.query = view.query
          }
        })
      } else {
        state.visitedViews.push({
          name: view.name,
          path: view.path,
          title: view.meta.title || 'no-name',
          query: view.query
        })
      }
      window.sessionStorage.setItem('quickMenu', JSON.stringify(state.visitedViews))
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      window.sessionStorage.setItem('quickMenu', JSON.stringify(state.visitedViews))
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      window.sessionStorage.setItem('quickMenu', JSON.stringify(state.visitedViews))
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
      state.visitedViews.push({
        name: 'main',
        path: '/main',
        title: '首页'
      })
      window.sessionStorage.setItem('quickMenu', JSON.stringify(state.visitedViews))
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
