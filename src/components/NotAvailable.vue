<template>
  <v-overlay :value="notAvailableDialog">
    <div>
      Es tut uns leid, aber Sie verfügen nicht über die benötigten Rechte um diese Seite einzusehen.
    </div>
    <v-btn
      :style="{ left: '50%', transform: 'translateX(-50%)' }"
      id="zurueck-button"
      rounded
      outlined
      @click="notAvailableDialog = false"
    >
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