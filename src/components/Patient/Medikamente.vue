<template>
  <v-container fluid v-if="rights == 1 || rights == 4">
    <v-data-iterator :items="medicaments" :items-per-page.sync="itemsPerPage" :page.sync="page" :search="search"
      sort-by="name" :sort-desc="sortDesc" hide-default-footer>
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"
            label="Search"></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card style="height:100%">
              <div style="display:flex; width:100%; margin: 0px; min-width:300px; min-height:300px">
                <img v-bind:src="item.profileImageSrc" alt=""
                  style="width:100%; margin:auto; max-width:300px; max-height:300px">
              </div>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    Menge:
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.amount }} Tabletten
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    Häufigkeit:
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.frequency }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    Beginn:
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.start }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    Dauer:
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.period }} Tage
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div style="width:100%; display:flex;justify-content:space-between">
                <v-avatar color="primary" style="margin:10px; margin-left:auto; cursor:pointer"
                  @click="inspectLeaflet(item)">
                  <v-icon dark>
                    mdi-clipboard-search-outline
                  </v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index"
                @click="updateItemsPerPage(number)">
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4
            grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
    <PackungsBeilage :leaflet=leaflet v-model="leafletDialog" />
  </v-container>
  <NotAvailable v-else />
</template>

<script>
  import NotAvailable from "../../components/NotAvailable";
  import PackungsBeilage from "../../components/PackungsBeilage";
  export default {
    data() {
      return {
        leaflet: null,
        leafletDialog: false,
        itemsPerPageArray: [4, 8, 12],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 4,
        sortBy: 'Meine',
      }
    },
    components: {
      NotAvailable,
      PackungsBeilage
    },
    computed: {
      numberOfPages() {
        return Math.ceil(this.medicaments.length / this.itemsPerPage)
      },
      filteredKeys() {
        return this.keys.filter(key => key !== 'Name')
      },
      rights() {
        return this.$store.getters.getRights;
      },
      medicaments() {
        console.log(this.$store.getters.getMyMedicaments)
        return this.$store.getters.getMyMedicaments
      },
    },
    watch: {
      medicaments(medicaments) {
        this.$store.dispatch("loadMedicamentsImages", medicaments);
      },
    },
    mounted() {
      this.$store.dispatch("fetchMyMedicaments", this.$store.getters.getUID);
    },
    methods: {
      inspectLeaflet(item) {
        this.leaflet = item.data
        this.leafletDialog = true
      },
      nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage(number) {
        this.itemsPerPage = number
      },
    },
  }
</script>