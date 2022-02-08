<template>
  <v-card
    class="light-blue lighten-5"
    v-if="rights == 3 || rights == 4"
    style="display: flex"
  >
    <template>
      <v-container class="light-blue lighten-5">
        <v-row> <p></p> </v-row>
        <v-row>
          <v-col>
            <v-file-input
              id="json-input"
              v-model="medicamentJson"
              accept=".json, application/json"
              label="Json auswählen"
            >
            </v-file-input>
          </v-col>
          <v-col cols="1"> </v-col>
          <v-col>
            <v-file-input
              id="img-input"
              v-model="medicamentImage"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
              label="Bild auswählen"
            ></v-file-input>
          </v-col>
        </v-row>

        <v-row>
          <div style="display: flex; width: 100%">
            <v-btn
              rounded
              outlined
              style="margin-left: auto; margin-bottom: 15px"
              id="upload-btn"
              depressed
              color="primary"
              @click.stop="uploadMedicaments"
            >
              Hochladen
            </v-btn>
          </div>
        </v-row>
      </v-container>
    </template>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    medicamentJson: null,
    medicamentImage: null,
  }),
  computed: {
    rights() {
      return this.$store.getters.getRights;
    },
  },
  methods: {
    uploadMedicaments() {
      this.$store.dispatch("readMedicaments", {
        json: this.medicamentJson,
        image: this.medicamentImage,
      });
    },
  },
};
</script>
<style scoped>
/* Buttons: */
#upload-btn {
  border-color: #2979ff !important;
  color: #2979ff !important;
}

#upload-btn:hover {
  background-color: #2979ff;
  color: white !important;
}

/* Input-Fields: */
#json-input {
  padding-right: 30px !important;
}

#img-input {
  margin-left: 30px !important;
}
</style>

<style>
#upload-btn {
  margin-top: auto;
  margin-left: 20px;
}
</style>