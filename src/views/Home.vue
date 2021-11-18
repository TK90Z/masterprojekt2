<template>
  <v-card color="" flat tile height="100vh" width="100vw">
    <v-toolbar dark color="primary">
      <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

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
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}<v-badge style="margin-left:5px" v-if="item.badge && newErrors != 0"
                :content=newErrors></v-badge>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view />
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
        items: [{
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
      }
    },
    computed: {
    },
    methods: {
      logout() {
        const auth = getAuth();
        signOut(auth).then(() => {
          this.$router.replace({
            name: "login"
          });
        })
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