<template>
  <v-card color="" flat tile height="100vh" width="100vw">
    <v-toolbar dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Medication-Master</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn tile @click="logout" class="top-menu-buttons">
        Abmelden
        <v-icon right>
          mdi-logout
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <div>
       <v-card-text>Patient</v-card-text>
      <v-list dense>
        <v-list-item v-for="item in patientItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </div>

<div>
  <v-card-text>Arzt</v-card-text>
      <v-list dense>
        <v-list-item v-for="item in docItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</div>
      
<div>
  <v-card-text>Admin</v-card-text>
      <v-list dense>
        <v-list-item v-for="item in adminItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</div>
      
    </v-navigation-drawer>
    <div data-app>
      <router-view />
</div>
  </v-card>
</template>

<script>
  import {
    getAuth,
    signOut
  } from "firebase/auth";
  export default {
    data() {
      return {
        drawer: null,
        patientItems: [{
            title: 'Medikamente',
            icon: 'mdi-office-building',
            link: "/medikamente"
          },
          {
            title: 'Kalender',
            icon: 'mdi-office-building-outline',
            link: "/kalender"
          },
        ],
        docItems: [{
            title: 'Medikamente',
            icon: 'mdi-office-building',
            link: "/medikamente"
          },
          {
            title: 'Kalender',
            icon: 'mdi-office-building-outline',
            link: "/kalender"
          },
        ],
        adminItems: [{
            title: 'Medikamente',
            icon: 'mdi-pill',
            link: "/medikamente"
          },
          {
            title: 'Kalender',
            icon: 'mdi-calendar',
            link: "/kalender"
          },
        ],
      }
    },
    computed: {},
    methods: {
      logout() {
        const auth = getAuth();
        signOut(auth).then(() => {})
      }
    },
  }
</script>
<style scoped>
  .top-menu-buttons {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1) !important;
    color: white !important;
  }
</style>