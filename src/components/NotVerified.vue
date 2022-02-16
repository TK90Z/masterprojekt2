<template>
  <v-overlay :value="notVerifiedDialog">
    <div>
      Bitte melden Sie sich an, um sich zu verifizieren und die Seite besuchen
      zu können.
    </div>
    <v-btn
      :style="{ left: '50%', transform: 'translateX(-50%)' }"
      id="zurueck-button"
      rounded
      outlined
      @click="notVerifiedDialog = false"
    >
      Zurück
    </v-btn>
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      notVerifiedDialog: true,
    };
  },
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