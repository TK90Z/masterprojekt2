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
          :type="type" @click:event="showEvent" @click:more="viewDay" @click:time="addEvent" @click:day="addEvent"
          @click:date="viewDay" @change="updateRange">
        </v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
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
  import AddEvent from './AddEvent.vue'
  export default {
    components: {
      AddEvent
    },
    data: () => ({
      deleteDialog: false,
      addEventDialog: false,
      focus: '',
      type: 'month',
      newEvent: {
        date: String,
        time: String,
      },
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
    },
    computed: {
      events() {
        return this.$store.getters.getOwnEvents
      }
    },
    methods: {
      deleteEvent() {
        this.$store.dispatch("deleteEvent", this.selectedEvent);
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
        this.deleteDialog = false
      },
      save(newElement) {
        var uid = this.$store.getters.getUID
        console.log(uid)
        this.$store.dispatch("createOwnEvents", {
          newElement: newElement,
          uid: uid
        });
      },
      addEvent(info) {
        this.newEvent.date = JSON.parse(JSON.stringify(info.date))
        this.newEvent.time = JSON.parse(JSON.stringify(info.time))
        this.addEventDialog = true
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
        const open = () => {
          this.selectedEvent = event
          console.log(event)
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
        this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>