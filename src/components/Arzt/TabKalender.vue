<template>
  <v-card v-if="rights == 2 || rights == 4">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      icons-and-text
      id="tabs"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tooltip bottom>
        <p class="mb-0">Hier können Sie all ihre Termine hinzufügen, </p>
        <p class="mb-0">egal ob private Treffen oder Termine in Ihrer </p>
        <p class="mb-0">Praxis. (Nur Sie sehen diese Ansicht.) </p>
        <template v-slot:activator="{ on }">
          <v-tab
            ripple
            v-on="on"
            @click="tab = 0"
            class="home-custom-tab"
            style="margin-left: auto"
          >
            <div>Eigene Termine</div>
            <v-icon class="tab-icon">mdi-calendar</v-icon>
          </v-tab>
        </template>
      </v-tooltip>
      <v-tooltip bottom>
        <p class="mb-0">Hier können Sie einen neuen Termin für einen </p>
        <p class="mb-0">Patienten buchen. Wählen Sie den Patienten, </p>
        <p class="mb-0">einen Tag und die Uhrzeit aus. Ihr Termin </p>
        <p class="mb-0">erscheint zunächst in "Unbestaetigte Termine". </p>
        <p class="mb-0">Bestätigte Termine finden Sie dann in "Eigene </p>
        <p class="mb-0">Termine". </p>
        <template v-slot:activator="{ on }">
          <v-tab ripple v-on="on" @click="tab = 1" class="home-custom-tab">
            <div>Termin buchen</div>
            <v-icon class="tab-icon">mdi-calendar-edit</v-icon>
          </v-tab>
        </template>
      </v-tooltip>
      <v-tooltip bottom>
        <p class="mb-0">Hier finden Sie ihre gebuchten, aber noch </p>
        <p class="mb-0">unbestätigten Termine. Wenn der Patient </p>
        <p class="mb-0">diese bestätigt hat, erscheinen sie in </p>
        <p class="mb-0">"Eigene Termine". </p>
        <template v-slot:activator="{ on }">
          <v-tab
            ripple
            v-on="on"
            @click="tab = 2"
            class="home-custom-tab"
            id="unbestaetigt-tab"
            style="margin-right: auto"
          >
            <v-badge color="red"
              v-if="unconfirmedEvents.length > 0"
              :content="unconfirmedEvents.length"
              >Unbestaetigte Termine
            </v-badge>
            <div v-else>Unbestaetigte Termine</div>
            <v-icon class="tab-icon">mdi-calendar-question</v-icon>
          </v-tab>
        </template>
      </v-tooltip>
    </v-tabs>
    <div class="tab-item-spacer"></div>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="0">
        <v-card flat class="home-tab-outer-wrapper">
          <v-card flat>
            <div class="basic-config-wrapper">
              <EigenerKalender />
            </div>
          </v-card>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="1">
        <v-card flat class="home-tab-outer-wrapper">
          <v-card flat>
            <BuchungKalender />
          </v-card>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="2">
        <v-card flat class="home-tab-outer-wrapper">
          <v-card flat>
            <UnbestaetigtKalender />
          </v-card>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
  <NotAvailable v-else />
</template>



<script>
import UnbestaetigtKalender from "./Kalender/UnbestaetigtKalender";
import EigenerKalender from "./Kalender/EigenerKalender.vue";
import BuchungKalender from "./Kalender/BuchungKalender";
import NotAvailable from "../../components/NotAvailable";
export default {
  data() {
    return {
      tab: 0,
      newLogo: false,
    };
  },
  created() {
    this.$store.dispatch("fetchUnconfirmedEvents", {
      ownUid: this.$store.getters.getUID,
      targetUid: this.$store.getters.getUID,
    });
    this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
  },
  props: {
    value: Boolean,
    editItem: null,
  },
  components: {
    UnbestaetigtKalender,
    EigenerKalender,
    NotAvailable,
    BuchungKalender,
  },
  computed: {
    rights() {
      return this.$store.getters.getRights;
    },
    unconfirmedEvents() {
      return this.$store.getters.getOwnUnconfirmedEvents;
    },
  },
};
</script>

<style scoped>
/* Tooltips */
.v-tooltip__content {
    font-size: 12px !important;
    line-height: 1.2;
}

/* Icons */
.tab-icon {
  padding-bottom: 4px;
}

/* Tabs */
.home-custom-tab {
  color: black !important;
}

.home-custom-tab:hover {
  background-color: rgb(202, 200, 200);
}

#tabs {
  padding-top: 5px;
  padding-bottom: 25px;
}

.v-tabs-slider-wrapper {
  color: #007bff;
  height: 4px !important;
}

#unbestaetigt-tab {
  min-width: 240px;
  align-content: center;
}
</style>