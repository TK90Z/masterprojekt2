import Vue from 'vue'
import VueRouter from 'vue-router'
import Medikamente from '../components/Patient/Medikamente'
import TabKalender from '../components/Patient/TabKalender'
import ArztMedikamente from '../components/Arzt/ArztMedikamente'
import ArztTabKalender from '../components/Arzt/ArztTabKalender'

Vue.use(VueRouter)

const routes = [
{
  path: '/patient/medikamente',
  name: 'Medikamente',
  component: Medikamente
},
{
  path: '/patient/kalender',
  name: 'Kalender',
  component: TabKalender
},
{
  path: '/arzt/medikamente',
  name: 'Medikamente',
  component: ArztMedikamente
},
{
  path: '/arzt/kalender',
  name: 'Kalender',
  component: ArztTabKalender
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
