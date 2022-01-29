<template>
  <div>
    <v-dialog
      transition="dialog-top-transition"
      v-model="show"
      fullscreen
      hide-overlay
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog.value = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ leaflet.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="form" @submit.prevent="submit">
            <v-expansion-panels
              v-for="(key, index) in filteredKeys"
              :key="index"
              v-model="panel"
              multiple
            >
              <v-expansion-panel :class="{ 'blue--text': sortBy === key }">
                <v-expansion-panel-header>Anwendung</v-expansion-panel-header>
                <v-expansion-panel-content>
                   
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Verwendung</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Some content
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Dosierung</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Some content
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Nebenwirkungen</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Some content
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ leaflet }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  Some content
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    leaflet: null,
  },
  data: () => ({}),
  computed: {
    filteredKeys() {
        return this.keys.filter((key) => key !== "Name");
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    
  },
  watch: {},
  methods: {},
};
</script>