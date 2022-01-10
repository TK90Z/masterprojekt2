import Vue from 'vue'
import VueRouter from 'vue-router'
import PatientMedikamente from '../components/Patient/Medikamente'
import Aerzte from '../components/Patient/Aerzte'
import PatientTabKalender from '../components/Patient/TabKalender'
import ArztMedikamente from '../components/Arzt/Medikamente'
import Patienten from '../components/Arzt/Patienten'
import ArztTabKalender from '../components/Arzt/TabKalender'
import NutzerVerwaltung from '../components/Admin/NutzerVerwaltung'
import MedikamnteHochladen from '../components/Admin/MedikamnteHochladen'

Vue.use(VueRouter)

const routes = [
{
  path: '/patient/medikamente',
  name: 'Medikamente',
  component: PatientMedikamente
},
{
  path: '/patient/aerzte',
  name: 'Ärzte',
  component: Aerzte
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
  path: '/arzt/patienten',
  name: 'Patienten',
  component: Patienten
},
{
  path: '/admin/userConfig',
  name: 'Nutzer Verwaltung',
  component: NutzerVerwaltung
},
{
  path: '/admin/uploadMedicine',
  name: 'Medikamente hochladen',
  component: MedikamnteHochladen
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
