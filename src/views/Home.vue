<template>
  <v-card color="" flat tile height="100vh" width="100vw">
    <v-toolbar dark color="primary">
      <v-app-bar-nav-icon
        v-if="rights != 0"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Medication-Master</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-avatar
        style="margin-right: 25px; cursor: pointer"
        @click.stop="profilePictureDialog = true"
      >
        <img v-if="profilePicture" v-bind:src="profilePicture" alt="John" />
        <v-icon v-else dark> mdi-account-circle </v-icon>
      </v-avatar>
      <v-dialog
        v-model="profilePictureDialog"
        transition="dialog-top-transition"
        max-width="600"
      >
        <template>
          <v-card>
            <v-toolbar color="primary" dark
              >Hier können Sie ein Profilbild hochladen.</v-toolbar
            >
            <v-card-text id="pb-text">
              <v-file-input
                v-model="newProfilePicture"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                label="Profilbild auswählen"
              ></v-file-input>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                id="abbrechen-button"
                rounded
                outlined
                color="red darken-1"
                text
                @click="profilePictureDialog = false"
                >Abbrechen</v-btn
              >
              <v-btn
                id="hochladen-button"
                rounded
                outlined
                color="blue accent-3"
                text
                @click="changeProfilePicture"
                >Hochladen</v-btn
              >
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn rounded @click="logout" outlined class="top-menu-buttons">
        Abmelden
        <v-icon right> mdi-logout </v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer class="blue accent-3" v-model="drawer" absolute temporary>
      <div v-if="rights == 1 || rights == 4">
        <v-card-text class="font-weight-bold card-texts">Patient</v-card-text>
        <v-list dense color="blue accent-3">
          <v-divider class="dividers" color="white"></v-divider>
          <v-list-item class="navigator-items"
            v-for="item in patientItems"
            :key="item.title"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon class="navigator-icons">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <div v-if="rights == 2 || rights == 4">
        <v-card-text class="font-weight-bold card-texts">Arzt</v-card-text>
        <v-list dense color="blue accent-3">
          <v-divider class="dividers" color="white"></v-divider>
          <v-list-item class="navigator-items"
            v-for="item in docItems"
            :key="item.title"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon class="navigator-icons">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <div v-if="rights == 3 || rights == 4">
        <v-card-text class="font-weight-bold card-texts">Admin</v-card-text>
        <v-list dense color="blue accent-3">
          <v-divider class="dividers" color="white"></v-divider>
          <v-list-item class="navigator-items"
            v-for="item in adminItems"
            :key="item.title"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon class="navigator-icons">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }} </v-list-item-title>
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
import { getAuth, signOut } from "firebase/auth";
import NotVerified from "../components/NotVerified";
export default {
  data() {
    return {
      newProfilePicture: null,
      profilePictureDialog: false,
      drawer: null,
      patientItems: [
        {
          title: "Medikamente",
          icon: "mdi-pill",
          link: "/patient/medikamente",
        },
        {
          title: "Ärzte",
          icon: "mdi-doctor",
          link: "/patient/aerzte",
        },
        {
          title: "Kalender",
          icon: "mdi-calendar",
          link: "/patient/kalender",
        },
      ],
      docItems: [
        {
          title: "Medikamente",
          icon: "mdi-pill",
          link: "/arzt/medikamente",
        },
        {
          title: "Patienten",
          icon: "mdi-account",
          link: "/arzt/patienten",
        },
        {
          title: "Kalender",
          icon: "mdi-calendar",
          link: "/arzt/kalender",
        },
      ],
      adminItems: [
        {
          title: "Nutzer Verwaltung",
          icon: "mdi-shield-key",
          link: "/admin/userConfig",
        },
        {
          title: "Medikamente hochladen",
          icon: "mdi-upload",
          link: "/admin/uploadMedicine",
        },
      ],
    };
  },
  components: {
    NotVerified,
  },
  created() {
    this.$store.dispatch("loadUserProfilePicture", this.$store.getters.getUID);
  },
  computed: {
    rights() {
      return this.$store.getters.getRights;
    },
    profilePicture() {
      return this.$store.getters.getProfilePicture;
    },
  },
  watch: {
    rights(value) {
      if (this.$route.name == null) {
        switch (value) {
          case 1:
            this.$router.push("/patient/kalender");
            break;
          case 2:
            this.$router.push("/arzt/kalender");
            break;
          case 3:
            this.$router.push("/admin/userConfig");
            break;
          case 4:
            this.$router.push("/admin/userConfig");
            break;
          default:
            break;
        }
      }
    },
  },
  methods: {
    changeProfilePicture() {
      this.$store.dispatch("uploadProfilePicture", {
        picture: this.newProfilePicture,
        uid: this.$store.getters.getUID,
      });
      this.profilePictureDialog = false;
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {});
    },
    makeActive(item) {
      this.active = item;
    }
  },
};
</script>
<style scoped>
/* Buttons: */
.top-menu-buttons {
  color: white !important;
}

.top-menu-buttons:hover {
  background-color: #e53935;
}

#abbrechen-button {
  border-color: #e53935 !important;
}

#abbrechen-button:hover {
  background-color: #e53935;
  color: white !important;
}

#hochladen-button {
  border-color: #2979FF !important;
}

#hochladen-button:hover {
  background-color: #2979FF;
  color: white !important;
}

/* Cards: */
#pb-text {
  margin-top: 12px;
}

.card-texts {
  font-size: 20px !important;
  color: white !important;
  background-color: #2979FF;
}

/* Navigator: */
.navigator-items {
  margin-top: 4px;
  color: white !important;
}

.navigator-items:hover {
  background-color: #42A5F5;
}

.navigator-icons {
  color: white;
}

.v-list-item--active {
  background-color: white;
  color: #2979FF !important;
}

.dividers {
  margin-top: -5px;
  margin-bottom: 11px;
}
</style>