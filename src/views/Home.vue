<template>
  <v-card color="" flat tile height="100vh" width="100vw">
    <v-toolbar dark color="primary">
      <v-app-bar-nav-icon v-if="rights != 0" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

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
      <div v-if="rights == 1 || rights == 4">
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

      <div v-if="rights == 2 || rights == 4">
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

      <div v-if="rights == 3 || rights == 4">
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
      <router-view v-if="rights != 0" />
      <NotVerified v-else />
    </div>
  </v-card>
</template>

<script>
  import {
    getAuth,
    signOut
  } from "firebase/auth";
  import NotVerified from "../components/NotVerified"
  export default {
    data() {
      return {
        drawer: null,
        patientItems: [{
            title: 'Medikamente',
            icon: 'mdi-pill',
            link: "/patient/medikamente",
          },
          {
            title: 'Kalender',
            icon: 'mdi-calendar',
            link: "/patient/kalender",
          },
        ],
        docItems: [{
            title: 'Medikamente',
            icon: 'mdi-pill',
            link: "/arzt/medikamente",
          },
          {
            title: 'Kalender',
            icon: 'mdi-calendar',
            link: "/arzt/kalender",
          },
        ],
        adminItems: [{
          title: 'Nutzer Verwaltung',
          icon: 'mdi-pill',
          link: "/admin/userConfig"
        }, ],
      }
    },
    components: {
      NotVerified,
    },
    computed: {
      rights() {
        return this.$store.getters.getRights
      }
    },
    watch: {
      rights(value) {
        switch (value) {
          case 1:
            this.$router.push('/patient/kalender')
            break;
          case 2:
            this.$router.push('/arzt/kalender')
            break;
          case 3:
            this.$router.push('/admin/userConfig')
            break;
          case 4:
            this.$router.push('/admin/userConfig')
            break;
          default:
            break;
        }
      }
    },
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