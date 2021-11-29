import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBq50BkXLd69Qc5nA7bohnTokPiCC6tLjw",
  authDomain: "medication-98c5a.firebaseapp.com",
  projectId: "medication-98c5a",
  storageBucket: "medication-98c5a.appspot.com",
  messagingSenderId: "198470916917",
  appId: "1:198470916917:web:dae6f23527bf83ca790a7c",
  measurementId: "G-2CXFLMVENZ"
}

console.log(firebaseConfig)

const app = initializeApp(firebaseConfig)

const projectAuth = getAuth(app)
const projectFirestore = getFirestore(app)

export { projectAuth, projectFirestore }

projectAuth.onAuthStateChanged(user => {
  //console.log("You are logged in now!")
  //console.log(user)
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
