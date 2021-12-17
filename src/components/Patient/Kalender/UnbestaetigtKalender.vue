<template>
  <v-row class="fill-height">
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
          :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange">
        </v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="confirmeEvent" v-if="selectedEvent.creator.toString() != uid">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
              <v-dialog v-model="deleteDialog" transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" fab plain>
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
  export default {
    data: () => ({
      deleteDialog: false,
      focus: '',
      events: [],
      type: 'month',
      typeToLabel: {
        month: 'Monat',
        week: 'Woche',
        day: 'Tag',
        '4day': '4 Tage',
      },
      selectedEvent: {
        creator:""
      },
      selectedElement: null,
      selectedOpen: false,
    }),
    mounted() {
      this.$refs.calendar.checkChange()
    },
    computed: {
      uid() {
        return this.$store.getters.getUID
      },
      unconfirmedEvents() {
        return this.$store.getters.getOwnUnconfirmedEvents
      },
      ownEvents() {
        return this.$store.getters.getOwnEvents
      }
    },
    watch: {
      uid() {
        this.updateCalendar()
      },
      unconfirmedEvents() {
        this.updateEvents()
      },
      ownEvents() {
        this.updateEvents()
      }
    },
    methods: {
      deleteEvent() {
        this.$store.dispatch("deleteEvent", this.selectedEvent);
        this.$store.dispatch("fetchUnconfirmedEvents", {ownUid: this.$store.getters.getUID, targetUid:this.$store.getters.getUID});
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
        this.deleteDialog = false
      },
      confirmeEvent(){
        console.log(this.selectedEvent)
        if(this.eventCollisionCheck(this.selectedEvent.start.split(" ")[1]) || this.eventCollisionCheck(this.selectedEvent.end.split(" ")[1])) {
          alert('Sie haben zu dieser Zeit schon einen Termin!');
        } else {
          console.log("All good")
          this.$store.dispatch("confirmUnconfirmedEvents", {confirmedEvent: this.selectedEvent, uids: {ownUid: this.$store.getters.getUID, targetUid: this.$store.getters.getUID}});
        }
      },
      eventCollisionCheck(value) {
        console.log(value)
        var collisionOccured = false
        var newTime = value.split(':')
        var newHappyHourD = new Date();
        newHappyHourD.setHours(parseInt(newTime[0]), parseInt(newTime[1]), 0);

        this.ownEvents.forEach(event => {
          var start = event.start.split(' ')
          var end = event.end.split(' ')
          if (!event.noCollision) {
            if (this.selectedEvent.start.split(" ")[0].toString() == start[0].toString()) {
              var startHappyHourD = new Date();
              var startTime = start[1].split(':')
              startHappyHourD.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0);

              var endHappyHourD = new Date();
              var endTime = end[1].split(':')
              endHappyHourD.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0);

              if (newHappyHourD >= startHappyHourD && newHappyHourD <= endHappyHourD) {
                collisionOccured = true
                return false
              }
            }
          }
        });
        return collisionOccured
      },
      updateCalendar() {
        this.$store.dispatch("fetchUnconfirmedEvents", {ownUid: this.$store.getters.getUID, targetUid: this.$store.getters.getUID});
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
      },
      updateEvents() {
        var ownEvents = JSON.parse(JSON.stringify(this.$store.getters.getOwnEvents))
        var unconfirmedEvents = JSON.parse(JSON.stringify(this.$store.getters.getOwnUnconfirmedEvents))
        ownEvents.forEach(element => {
          element.color = "#00ff00"
        });
        unconfirmedEvents.forEach(element => {
          element.color = "#ff0000"
        });
        this.events = ownEvents.concat(unconfirmedEvents)
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
        console.log(event.creator.toString())
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
      },
      updateRange() {
        this.$store.dispatch("fetchUnconfirmedEvents", {ownUid: this.$store.getters.getUID, targetUid: this.$store.getters.getUID});
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>