import Vue from 'vue'
import VueRouter from 'vue-router'
import PatientMedikamente from '../components/Patient/Medikamente'
import PatientTabKalender from '../components/Patient/TabKalender'
import ArztMedikamente from '../components/Arzt/Medikamente'
import ArztTabKalender from '../components/Arzt/TabKalender'
import NutzerVerwaltung from '../components/Admin/NutzerVerwaltung'

Vue.use(VueRouter)

const routes = [
{
  path: '/patient/medikamente',
  name: 'Medikamente',
  component: PatientMedikamente
},
{
  path: '/patient/kalender',
  name: 'Kalender',
  component: PatientTabKalender
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
{
  path: '/admin/userConfig',
  name: 'Nutzer Verwaltung',
  component: NutzerVerwaltung
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
