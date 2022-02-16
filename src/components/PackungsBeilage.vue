<template>
  <div>
    <v-dialog transition="dialog-top-transition" v-model="show" fullscreen hide-overlay>
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
            <v-expansion-panels>
              <v-expansion-panel v-for="(key, index) in sortedLeaflet" :key="index" multiple>
                <v-expansion-panel-header>{{ capitalizeFirstLetter(index) }}</v-expansion-panel-header>
                <v-expansion-panel-content v-if="index == 'ref'">
                  Für mehr Informationen <a target="_blank" v-bind:href="displayLink(key)">klicken sie hier!</a>
                </v-expansion-panel-content>
                <v-expansion-panel-content v-else>
                  <template v-if="Array.isArray(key)">
                    <v-list disabled>
                      <v-list-item v-for="(item, i) in key" :key="i">
                        <v-list-item-content>
                          <v-list-item-title v-text="item"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </template>
                  <v-expansion-panels v-else-if="typeof key === 'object' && key !== null">
                    <v-expansion-panel v-for="(key2, index2) in key" :key="index2" multiple>
                      <v-expansion-panel-header>{{ capitalizeFirstLetter(index2) }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <template v-if="Array.isArray(key2)">
                          <v-list disabled>
                            <v-list-item v-for="(item2, i2) in key2" :key="i2">
                              <v-list-item-content>
                                <v-list-item-title v-text="item2"></v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </template>
                        <v-expansion-panels v-else-if="typeof key2 === 'object' && key2 !== null">
                          <v-expansion-panel v-for="(key3, index3) in key2" :key="index3" multiple>
                            <v-expansion-panel-header>{{ capitalizeFirstLetter(index3) }}</v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <template v-if="Array.isArray(key3)">
                                <v-list disabled>
                                  <v-list-item v-for="(item3, i3) in key3" :key="i3">
                                    <v-list-item-content>
                                      <v-list-item-title v-text="item3"></v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </template>
                              <p v-else>{{ key }}</p>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                        <p v-else>{{ key2 }}</p>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <p v-else>{{ key }}</p>
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
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      displayLink(link) {
        var splitLink = link.split(': ');
        return splitLink[1]
      }
    },
    computed: {
      show: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        },
      },
      sortedLeaflet() {
        return {
          darreichungsform: this.leaflet.darreichungsform,
          anwendung: this.leaflet.anwendung,
          wirkung: this.leaflet.wirkung,
          verwendung: this.leaflet.verwendung,
          info: this.leaflet.info,
          dosierung: this.leaflet.dosierung,
          nebenwirkungen: this.leaflet.nebenwirkungen,
          ref: this.leaflet.ref,
        }
      },
    },
    watch: {},
  };
</script>