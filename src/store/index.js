import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import patientTermine from './patient_Termine'

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
    patientTermine
  }
})
