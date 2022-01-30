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
            class="mr-4 buttons"
            color="grey darken-2"
            @click="setToday"
          >
            Heute
          </v-btn>
          <v-btn fab text small color="grey darken-3" @click="prev">
            <v-icon small class="left-right-buttons"> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-3" @click="next">
            <v-icon small class="left-right-buttons"> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title id="toolbar-title" v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            id="ansicht-menu"
            transition="slide-y-transition"
            bottom
            right
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
              rounded="lg"
              class="text-center"
              color="rgb(241, 237, 237)"
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
          @click:time="addEvent"
          @click:day="addEvent"
          @click:date="viewDay"
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
                  <v-btn v-bind="attrs" v-on="on" fab plain>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <template>
                  <v-card>
                    <v-toolbar color="primary" dark>Termin löschen</v-toolbar>
                    <v-card-text id="loeschen-card">
                      Wollen Sie diesen Termin wirklich löschen?
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        id="loeschen-card-loeschen"
                        text
                        @click="deleteEvent"
                        >Löschen</v-btn
                      >
                      <v-btn
                        class="abbrechen-buttons"
                        text
                        @click="deleteDialog = false"
                        >Abbrechen</v-btn
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
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Abbrechen
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
    focus: "",
    type: "month",
    newEvent: {
      date: String,
      time: String,
    },
    typeToLabel: {
      month: "Monat",
      week: "Woche",
      day: "Tag",
      "4day": "4 Tage",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    events() {
      return this.$store.getters.getOwnEvents;
    },
  },
  methods: {
    makeActive(item) {
      // When a model is changed, the view will be automatically updated.
      this.active = item;
    },
    deleteEvent() {
      this.$store.dispatch("deleteEvent", this.selectedEvent);
      this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
      this.deleteDialog = false;
    },
    save(newElement) {
      var uid = this.$store.getters.getUID;
      console.log(uid);
      this.$store.dispatch("createOwnEvents", {
        newElement: newElement,
        uid: uid,
      });
    },
    addEvent(info) {
      this.newEvent.date = JSON.parse(JSON.stringify(info.date));
      this.newEvent.time = JSON.parse(JSON.stringify(info.time));
      this.addEventDialog = true;
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
      const open = () => {
        this.selectedEvent = event;
        console.log(event);
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
/* Tooltips */
.v-tooltip__content {
  font-size: 12px !important;
  line-height: 1.2;
}

/* Buttons */
.menu-buttons:hover {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(57, 151, 240);
}

#heute-button {
  color: rgb(11, 95, 11) !important;
}

#heute-button:hover {
  color: rgb(11, 95, 11) !important;
  background-color: rgb(137, 255, 137);
}

#ansicht-button {
  color: black !important;
}

#ansicht-button:hover {
  color: black !important;
  background-color: rgb(241, 237, 237);
}

.left-right-buttons {
  color: black !important;
}

/* Toolbar */
#toolbar-title {
  margin-left: 12px !important;
  font-weight: bold !important;
}

/* Menus */
.v-application .v-autocomplete__content.menuable__content__active {
  border-radius: 20px !important;
}

.day .day,
.week .week,
.month .month,
.fourday .fourday {
  color: rgb(39, 180, 39) !important;
}

.day .day:hover,
.week .week:hover,
.month .month:hover,
.fourday .fourday:hover {
  color: rgba(72, 255, 0, 0.945) !important;
}

/* Cards */
#loeschen-card {
  color: black;
  align-content: left;
}

#loeschen-card-loeschen:hover {
  background-color: rgb(240, 58, 58);
  color: white;
}

.abbrechen-buttons:hover {
  background-color: darkgrey;
}

/* Calendar */
#calendar {
  margin-top: 2px;
}
</style>