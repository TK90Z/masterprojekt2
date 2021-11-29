<template>
  <v-app>
    <main>
      <login v-if="!isLoggedIn"></login>
      <home v-if="isLoggedIn"></home>
    </main>
  </v-app>
</template>

<script>
import login from "./views/Login";
import home from "./views/Home";

export default {
  components: {
    login,
    home
  },
  
  computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn)
      return this.$store.getters.isLoggedIn
    }
  }
};
</script>