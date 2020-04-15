
const user = {
  state: {
    name: '',
    avatar: ''
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  }
}

export default user
