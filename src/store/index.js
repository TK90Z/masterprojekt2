import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import ownEvents from './ownEvents'
import foreignEvents from './foreignEvents'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    login,
    ownEvents,
    foreignEvents
  }
})
