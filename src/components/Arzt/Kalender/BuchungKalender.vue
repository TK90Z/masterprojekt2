<template>
  <v-row class="fill-height">
    <AddEvent :newEvent=newEvent :events=events v-model="addEventDialog" @saved="save" />
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Heute
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-autocomplete v-model='patient' :items='patients' item-text="name" item-value="uid" label='Patient'
            v-on:change='changePatient' class="autocomplete_patient"></v-autocomplete>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Tag</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Woche</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Monat</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Tage</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
          :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @click:time="addEvent"
          @click:day="addEvent" @change="updateRange">
        </v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="deleteDialog" transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" fab plain
                    v-if="selectedEvent.creator == uid || selectedEvent.receiver == uid">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <template>
                  <v-card>
                    <v-toolbar color="primary" dark>Termin löschen</v-toolbar>
                    <v-card-text>
                      Wollen Sie diesen Termin wirklich löschen?
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="deleteEvent">Löschen</v-btn>
                      <v-btn text @click="deleteDialog = false">Abbrechen</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
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
  import AddEvent from './AddEvent.vue'
  export default {
    components: {
      AddEvent
    },
    data: () => ({
      deleteDialog: false,
      addEventDialog: false,
      patient: null,
      events: [],
      newEvent: {
        date: String,
        time: String,
      },
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Monat',
        week: 'Woche',
        day: 'Tag',
        '4day': '4 Tage',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    }),
    mounted() {
      this.$refs.calendar.checkChange()
      this.$store.dispatch("fetchPatients");
    },
    computed: {
      patients() {
        return this.$store.getters.getPatients
      },
      uid() {
        return this.$store.getters.getUID
      },
      foreignEvents() {
        return this.$store.getters.getForeignEvents
      },
      ownEvents() {
        return this.$store.getters.getOwnEvents
      }
    },
    watch: {
      uid() {
        this.updateCalendar()
      },
      patient() {
        this.updateCalendar()
      },
      foreignEvents() {
        this.updateEvents()
      },
      ownEvents() {
        this.updateEvents()
      }
    },
    methods: {
      deleteEvent() {
        if (this.selectedEvent.creator == this.uid || this.selectedEvent.receiver == this.uid) {
          this.$store.dispatch("deleteEvent", this.selectedEvent);
          this.$store.dispatch("fetchForeignEvents", this.patient);
          this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
          this.deleteDialog = false
        }
      },
      addEvent(info) {
        if (this.patient) {
          this.newEvent.date = JSON.parse(JSON.stringify(info.date))
          this.newEvent.time = JSON.parse(JSON.stringify(info.time))
          this.addEventDialog = true
        } else {
          alert('Bitte wählen Sie zuerst einen Doktor aus!');
        }
      },
      save(newElement) {
        var uid = this.patient
        console.log(uid)
        this.$store.dispatch("createUnconfirmedEvents", {
          newElement: newElement,
          uids: {
            ownUid: this.$store.getters.getUID,
            targetUid: uid
          }
        });
      },
      updateCalendar() {
        this.$store.dispatch("fetchForeignEvents", this.patient);
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
      },
      updateEvents() {
        var ownEvents = JSON.parse(JSON.stringify(this.$store.getters.getOwnEvents))
        var foreignEvents = JSON.parse(JSON.stringify(this.$store.getters.getForeignEvents))
        ownEvents.forEach(element => {
          element.color = "#00ff00"
        });
        foreignEvents.forEach(element => {
          element.color = "#ff0000"
        });
        this.events = ownEvents.concat(foreignEvents)
      },
      changePatient(patient) {
        console.log(patient)
      },
      viewDay({
        date
      }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor(event) {
        return event.color
      },
      setToday() {
        this.focus = ''
      },
      prev() {
        this.$refs.calendar.prev()
      },
      next() {
        this.$refs.calendar.next()
      },
      showEvent({
        nativeEvent,
        event
      }) {
        if (event.receiver == this.uid || event.creator == this.uid) {
          const open = () => {
            this.selectedEvent = event
            this.selectedElement = nativeEvent.target
            requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
          }

          if (this.selectedOpen) {
            this.selectedOpen = false
            requestAnimationFrame(() => requestAnimationFrame(() => open()))
          } else {
            open()
          }

          nativeEvent.stopPropagation()
        }
      },
      updateRange() {
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>

<style>
  .autocomplete_patient .v-text-field__details {
    display: none
  }

  .autocomplete_patient {
    margin-right: 15px;
  }
</style>