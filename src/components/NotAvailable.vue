<template>
  <v-overlay :value="notAvailableDialog">
    <div>
      Es tut uns leid, aber Sie verfügen nicht über die benötigten Rechte um diese Seite einzusehen.
    </div>
    <v-btn :style="{ left: '50%', transform: 'translateX(-50%)' }" id="zurueck-button" rounded outlined
      @click="goBack()">
      Zurück
    </v-btn>
  </v-overlay>
</template>

<script>
  export default {
    data() {
      return {
        notAvailableDialog: true,
      };
    },
    computed: {
      rights() {
        console.log(this.$store.getters.getRights)
        return this.$store.getters.getRights;
      },
    },
    methods: {
      goBack() {
        console.log(this.rights)
        if (this.rights == 1) {
          this.$router.push('/patient/kalender')
        } else if (this.rights == 2) {
          this.$router.push('/arzt/kalender')
        } else if (this.rights == 3) {
          this.$router.push('/admin/userConfig')
        } else {
          this.$router.push('/')
        }
      }
    }
  };
</script>

<style scoped>
  /* Buttons: */
  #zurueck-button {
    border-color: #2979ff !important;
    color: #2979ff !important;
    text-align: center;
    margin-top: 10px;
  }

  #zurueck-button:hover {
    background-color: #2979ff;
    color: white !important;
  }
</style>