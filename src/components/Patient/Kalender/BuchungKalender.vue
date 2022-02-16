<template>
  <v-row class="fill-height">
    <AddEvent
      :newEvent="newEvent"
      :events="events"
      v-model="addEventDialog"
      @saved="save"
    />
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat class="light-blue lighten-5">
          <v-btn
            id="heute-button"
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Heute
          </v-btn>
          <v-btn fab text small color="grey darken-3" @click="prev">
            <v-icon small class="left-right-buttons"> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-3" @click="next">
            <v-icon small class="left-right-buttons">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title id="toolbar-title" v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-autocomplete
            color="black"
            v-model="doctor"
            :items="doctors"
            item-text="name"
            item-value="uid"
            label="Doktor"
            v-on:change="changeDoctor"
            class="autocomplete_doctor"
          ></v-autocomplete>
          <v-menu
            id="ansicht-menu"
            transition="slide-y-transition"
            bottom
            right
            rounded="lg"
            offset-y
          >
            <template v-slot:activator="{ on: menu }">
              <v-tooltip id="menu-tooltip" top>
                <template v-slot:activator="{ on: tooltip, attrs }">
                  <v-btn
                    id="ansicht-button"
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <span>Ansicht ändern </span>
              </v-tooltip>
            </template>
            <v-list
              ripple
              v-bind:class="active"
              rounded
              class="text-center"
              color="blue-grey lighten-5"
            >
              <v-list-item
                class="menu-buttons day"
                v-on:click="makeActive('day')"
                @click="type = 'day'"
              >
                <v-list-item-title>Tag</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="menu-buttons week"
                v-on:click="makeActive('week')"
                @click="type = 'week'"
              >
                <v-list-item-title>Woche</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="menu-buttons month"
                v-on:click="makeActive('month')"
                @click="type = 'month'"
              >
                <v-list-item-title>Monat</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="menu-buttons fourday"
                v-on:click="makeActive('fourday')"
                @click="type = '4day'"
              >
                <v-list-item-title>4 Tage</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          id="calendar"
          ref="calendar"
          v-model="focus"
          color="light-green accent-4"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @click:time="addEvent"
          @click:day="addEvent"
          @change="updateRange"
        >
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="deleteDialog"
                transition="dialog-top-transition"
                max-width="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    fab
                    plain
                    v-if="
                      selectedEvent.creator == uid ||
                      selectedEvent.receiver == uid
                    "
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <template>
                  <v-card class="light-blue lighten-5">
                    <v-toolbar color="primary" dark>Termin löschen</v-toolbar>
                    <v-card-text class="loeschen-card">
                      Wollen Sie diesen Termin wirklich löschen?
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        class="abbrechen-buttons"
                        rounded
                        outlined
                        text
                        @click="deleteEvent"
                        >Löschen</v-btn
                      >
                      <v-btn
                        class="erstellen-buttons"
                        rounded
                        outlined
                        text
                        @click="deleteDialog = false"
                        >Zurück</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                class="abbrechen-buttons"
                rounded
                outlined
                text
                @click="selectedOpen = false"
              >
                Schließen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import AddEvent from "./AddEvent.vue";
export default {
  components: {
    AddEvent,
  },
  data: () => ({
    deleteDialog: false,
    addEventDialog: false,
    active: "month",
    doctor: null,
    events: [],
    newEvent: {
      date: String,
      time: String,
    },
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.$store.dispatch("fetchDoctors");
  },
  computed: {
    doctors() {
      return this.$store.getters.getDoctors;
    },
    uid() {
      return this.$store.getters.getUID;
    },
    foreignEvents() {
      return this.$store.getters.getForeignEvents;
    },
    ownEvents() {
      return this.$store.getters.getOwnEvents;
    },
  },
  watch: {
    uid() {
      this.updateCalendar();
    },
    doctor() {
      this.updateCalendar();
    },
    foreignEvents() {
      this.updateEvents();
    },
    ownEvents() {
      this.updateEvents();
    },
  },
  methods: {
    makeActive(item) {
      // When a model is changed, the view will be automatically updated.
      this.active = item;
    },
    deleteEvent() {
      if (
        this.selectedEvent.creator == this.uid ||
        this.selectedEvent.receiver == this.uid
      ) {
        this.$store.dispatch("deleteEvent", this.selectedEvent);
        this.$store.dispatch("fetchForeignEvents", this.doctor);
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
        this.deleteDialog = false;
      }
    },
    addEvent(info) {
      if (this.doctor) {
        this.newEvent.date = JSON.parse(JSON.stringify(info.date));
        this.newEvent.time = JSON.parse(JSON.stringify(info.time));
        this.addEventDialog = true;
      } else {
        alert("Bitte wählen Sie zuerst einen Doktor aus!");
      }
    },
    save(newElement) {
      var uid = this.doctor;
      console.log(uid);
      this.$store.dispatch("createUnconfirmedEvents", {
        newElement: newElement,
        uids: {
          ownUid: this.$store.getters.getUID,
          targetUid: uid,
        },
      });
    },
    updateCalendar() {
      this.$store.dispatch("fetchForeignEvents", this.doctor);
      this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
    },
    updateEvents() {
      var ownEvents = JSON.parse(
        JSON.stringify(this.$store.getters.getOwnEvents)
      );
      var foreignEvents = JSON.parse(
        JSON.stringify(this.$store.getters.getForeignEvents)
      );
      ownEvents.forEach((element) => {
        element.color = "#00ff00";
      });
      foreignEvents.forEach((element) => {
        element.color = "#ff0000";
      });
      this.events = ownEvents.concat(foreignEvents);
    },
    changeDoctor(doctor) {
      console.log(doctor);
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      if (event.receiver == this.uid || event.creator == this.uid) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => (this.selectedOpen = true))
          );
        };

        if (this.selectedOpen) {
          this.selectedOpen = false;
          requestAnimationFrame(() => requestAnimationFrame(() => open()));
        } else {
          open();
        }

        nativeEvent.stopPropagation();
      }
    },
    updateRange() {
      this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style>
.autocomplete_doctor .v-text-field__details {
  display: none;
}

.autocomplete_doctor {
  margin-right: 15px;
}

/* Cards (für alle 3 Kalender in "Arzt"): */
.loeschen-card {
  margin-top: 12px;
}
</style>