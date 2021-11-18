import Vue from 'vue'
import VueRouter from 'vue-router'
import Medikamente from '../components/Medikamente'
import Kalender from '../components/Kalender'

Vue.use(VueRouter)

const routes = [
{
  path: '/medikamente',
  name: 'Medikamente',
  component: Medikamente
},
{
  path: '/kalender',
  name: 'Kalender',
  component: Kalender
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
