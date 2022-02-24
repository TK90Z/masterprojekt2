<template>
  <v-container
    class="light-blue lighten-5"
    fluid
    v-if="rights == 2 || rights == 4"
  >
    <v-data-iterator
      :loading="loading"
      loading-text="Medikamente werden geladen..."
      :items="medicaments"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      sort-by="name"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field
            rounded
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Suche"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <div class="alpha-sort">Alphabetisch sortieren:</div>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    elevation="3"
                    small
                    depressed
                    color="blue"
                    :value="false"
                  >
                    <v-icon small>mdi-arrow-up</v-icon>
                  </v-btn>
                </template>
                <span>aufsteigend</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    elevation="3"
                    small
                    depressed
                    color="blue"
                    :value="true"
                  >
                    <v-icon small>mdi-arrow-down</v-icon>
                  </v-btn>
                </template>
                <span>absteigend</span>
              </v-tooltip>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              id="v-card"
              style="height: 100%; display: flex; flex-direction: column"
              elevation="10"
              outlined
            >
              <div
                style="
                  display: flex;
                  width: 100%;
                  margin: 0px;
                  min-width: 300px;
                  min-height: 300px;
                  max-height: 300px;
                "
              >
                <img
                  v-bind:src="item.profileImageSrc"
                  alt=""
                  style="
                    max-width: 100%;
                    margin: auto;
                    max-width: 300px;
                    max-height: 100%;
                    padding: 10px;
                  "
                />
              </div>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content class="font-weight-medium"> Form: </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.darreichungsform }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="font-weight-medium"> Menge: </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.info }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content id="med-wirkung" class="align-end max-text-lines-6 text-justify">
                    {{ item.wirkung }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  margin-top: auto;
                "
              >
                <v-tooltip bottom>
                  <span class="mb-0">Packungsbeilage</span>
                  <template v-slot:activator="{ on }">
                    <v-avatar
                      color="primary"
                      style="margin: 10px; margin-left: auto; cursor: pointer"
                      v-on="on"
                      @click="inspectLeaflet(item)"
                    >
                      <v-icon dark> mdi-clipboard-search-outline </v-icon>
                    </v-avatar>
                  </template>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template
        v-slot:no-data
      >
        Es konnten leider keine Medikamente gefunden werden!
      </template>

      <template
        v-slot:no-results
      >
        Es konnten leider keine Medikamente gefunden werden!
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text items-per-page">Items per page:</span>
          <v-menu offset-y top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                id="seitenanzahl-button"
                rounded
                dark
                text
                color="primary"
                class="ml-2 items-per-page"
                v-bind="attrs"
                v-on="on"
                @click="show = !show"
              >
                {{ itemsPerPage }}
                <v-icon>{{
                  !show ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </template>
            <v-list
              rounded
              class="text-center"
              color="blue-grey lighten-5"
            >
              <v-list-item
                class="pages-count"
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <span class="mr-4 grey--text page-buttons">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            small
            fab
            dark
            color="blue darken-3"
            class="mr-1 page-buttons"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            small
            fab
            dark
            color="blue darken-3"
            class="ml-1 page-buttons"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
    <PackungsBeilage :leaflet="leaflet" v-model="leafletDialog" />
  </v-container>
  <NotAvailable v-else />
</template>

<script>
import NotAvailable from "../../components/NotAvailable";
import PackungsBeilage from "../../components/PackungsBeilage";
export default {
  data() {
    return {
      loading: true,
      show: false,
      leaflet: null,
      leafletDialog: false,
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "Meine",
    };
  },
  components: {
    NotAvailable,
    PackungsBeilage,
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.medicaments.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
    rights() {
      return this.$store.getters.getRights;
    },
    medicaments() {
      return this.$store.getters.getMedicaments;
    },
  },
  watch: {
    medicaments(medicaments) {
      this.$store.dispatch("loadMedicamentsImages", medicaments);
      setTimeout(function(){
                    this.loading = false
                }, 2000);
    },
  },
  mounted() {
    this.$store.dispatch("fetchMedicaments");
  },
  methods: {
    inspectLeaflet(item) {
      this.leaflet = item;
      this.leafletDialog = true;
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
};
</script>

<style>
/* Layout (Buttons, Hinweise): */
.items-per-page {
  margin-left: 12px;
  margin-top: 8px;
}

.alpha-sort {
  margin-right: 10px;
  font-size: 14px;
}

.page-buttons {
  margin-bottom: 8px;
  margin-top: 8px;
  margin-right: 12px;
}

/* Cards: */
#v-card {
  margin-top: 6px;
}

.max-text-lines-5 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;
  padding-bottom: 5px !important;
  padding-top: 5px !important;
}
</style>

<style scoped>
#med-wirkung {
  font-size: 14px;
}
</style>