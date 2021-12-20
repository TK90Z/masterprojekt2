import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import ownEvents from './ownEvents'
import foreignEvents from './foreignEvents'
import patients from './patients'
import doctors from './doctors'
import unconfirmedEvents from './unconfirmedEvents'
import universalDelete from './universalDelete'
import users from './users'


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
    foreignEvents,
    patients,
    doctors,
    unconfirmedEvents,
    universalDelete,
    users
  }
})
