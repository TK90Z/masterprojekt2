<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/main"
export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user", 
    })
  },

  data: () => ({
  today: new Date().toISOString().substring(0, 10),
  focus: new Date().toISOString().substring(0, 10),
  type: "month",
  typeToLabel: {
    month: "Monat",
    week: "Woche",
    day: "Tag"
  },
  name: null,
  details: null,
  start: null,
  end: null,
    color: "#197602",
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false
  }),

  title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear
      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)
      switch (this.type) {
        case 'month':
        return `${startMonth} ${startYear}`
        case 'week':
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
        return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    },

  mounted() {
    this.getEvents();
  },

  methods: {
    async getEvents() {
      let snapshot = await db.collection('Kalender').get();
      let events = [];
      snapshot.forEach(doc => {
        //console.log(doc);
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      })

      this.events = events;
    },
    
    setDialogDate( { date }) {
      this.dialogDate = true
      this.focus = date
    },

    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    
    getEventColor (event) {
      return event.color
    },
    
    setToday () {
      this.focus = this.today
    },
    
    prev () {
      this.$refs.calendar.prev()
    },
    
    next () {
      this.$refs.calendar.next()
    },
    
    async addEvent () {
      if (this.name && this.start && this.end) {
        await db.collection("Kalender").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        })
        this.getEvents()
        this.name = '',
        this.details = '',
        this.start = '',
        this.end = '',
        this.color = ''
      } else {
        alert('You must enter event name, start, and end time')
      }
    },
    
    editEvent (ev) {
      this.currentlyEditing = ev.id
    },
    
    async updateEvent (ev) {
      await db.collection("Kalender").doc(this.currentlyEditing).update({
        details: ev.details
      })
      this.selectedOpen = false,
      this.currentlyEditing = null
    },
    
    async deleteEvent (ev) {
      await db.collection("Kalender").doc(ev).delete()
      this.selectedOpen = false,
      this.getEvents()
    },
    
    showEvent ({ nativeEvent, event }) { //actual event and calendar event
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10) //event shown with 10ms delay
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10) //opens another event with 10ms delay and sets to true
      } else {
        open() //opens event like above
      }
      nativeEvent.stopPropagation()
    },
   
    updateRange ({ start, end }) {  
      this.start = start
      this.end = end
    },
    
    nth (d) {
      return d > 3 && d < 21
      ? 'th'
      : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    }
  }
};
</script>