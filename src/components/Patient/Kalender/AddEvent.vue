<template>
    <div>
        <v-dialog transition="dialog-top-transition" v-model="show">
            <template v-slot:default="dialog">
                <v-card>
                    <v-toolbar color="primary" dark>Termin erstellen</v-toolbar>
                    <v-form ref="form" @submit.prevent="submit">
                        <v-card-text>
                            <v-container fluid>
                                <v-row justify="center" align="center">
                                    <v-col sm="12" md="12" lg="8" xl="8">
                                        <v-text-field label="Datum" :rules="[ dateRules ]" v-model="date" solo>

                                        </v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="12" lg="4" xl="4">
                                        <v-text-field label="Farbe" :maxlength="7" :rules="[ hexRules ]" v-model="color"
                                            solo>
                                            <template v-slot:append>
                                                <v-menu v-model="menu" top nudge-bottom="105" nudge-left="16"
                                                    :close-on-content-click="false">
                                                    <template v-slot:activator="{ on }">
                                                        <div :style="swatchStyle" v-on="on" />
                                                    </template>
                                                    <v-card>
                                                        <v-card-text>
                                                            <v-color-picker v-model="color" />
                                                        </v-card-text>
                                                    </v-card>
                                                </v-menu>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="12" lg="12" xl="12">
                                        <v-text-field label="Name" :rules="[ nameRules ]" v-model="name" solo>

                                        </v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="12" lg="6" xl="6">
                                        <v-text-field label="Startzeit" :rules="[ startRules ]" v-model="start" solo>

                                        </v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="12" lg="6" xl="6">
                                        <v-text-field label="EndZeit" :rules="[ endRules ]" v-model="end" solo>

                                        </v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="12" lg="12" xl="12">
                                        <v-textarea v-model="details" color="teal"><template v-slot:label>
                                                <div>
                                                    Details <small>(optional)</small>
                                                </div>
                                            </template>
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn text @click="dialog.value = false">Schließen</v-btn>
                            <v-btn text :disabled="!formIsValid" @click="create">Erstellen</v-btn>
                        </v-card-actions>
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
            newEvent: null,
            events: null
        },
        data: () => ({
            color: '#FF0000',
            date: '',
            name: '',
            start: '',
            end: '',
            details: '',
            menu: false,
            dateIsValid: true,
            hexIsValid: true,
            nameIsValid: true,
            startIsValid: true,
            endIsValid: true,
            formIsValid: false,
        }),
        computed: {
            swatchStyle() {
                const {
                    color,
                    menu
                } = this
                return {
                    backgroundColor: color,
                    cursor: 'pointer',
                    height: '30px',
                    width: '30px',
                    borderRadius: menu ? '50%' : '4px',
                    transition: 'border-radius 200ms ease-in-out'
                }
            },
            show: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                }
            },
        },
        watch: {
            show(value) {
                if (value) {
                    this.date = this.newEvent.date
                    this.start = this.newEvent.time
                    this.name = ""
                    this.details = ""
                    if (this.start == "") {
                        this.end = ""
                    } else {
                        var startParts = this.start.split(":")
                        var endTime = parseInt(startParts[0]) < 10 ? "0" + (parseInt(startParts[0]) + 1).toString() +
                            ":" + startParts[1] : (parseInt(startParts[0]) + 1).toString() + ":" + startParts[1]
                        this.end = endTime
                    }
                }
            }
        },
        methods: {
            create() {
                console.log("Abschicken")
                var newElement = {
                    color: this.color,
                    details: this.details,
                    end: this.date + " " + this.end,
                    name: this.name,
                    start: this.date + " " + this.start,
                    creator: this.$store.getters.getUID,
                    receiver: "",
                    id: "",
                }
                this.$emit("saved", newElement)
                this.show = false
            },
            dateRules(value) {
                const pattern = /^\d{4}([-])\d{2}\1\d{2}$/
                if (value.length === 0) {
                    this.dateIsValid = false;
                    this.formIsValid = false
                    return "Required.";
                } else if (!pattern.test(value)) {
                    this.dateIsValid = false
                    this.formIsValid = false
                    return 'Invalid date.'
                } else {
                    this.dateIsValid = true
                    if (this.dateIsValid && this.hexIsValid && this.nameIsValid && this.startIsValid && this
                        .endIsValid) {
                        this.formIsValid = true
                    }
                    return true;
                }
            },
            hexRules(value) {
                const pattern = /^[#]{1}[0-9A-Fa-f]{6}$/
                if (value.length === 0) {
                    this.hexIsValid = false;
                    this.formIsValid = false
                    return "Required.";
                } else if (value.length != 7) {
                    this.hexIsValid = false
                    this.formIsValid = false
                    return 'Max 7 characters.'
                } else if (!pattern.test(value)) {
                    this.hexIsValid = false
                    this.formIsValid = false
                    return 'Invalid hexcode.'
                } else {
                    this.hexIsValid = true
                    if (this.dateIsValid && this.hexIsValid && this.nameIsValid && this.startIsValid && this
                        .endIsValid) {
                        this.formIsValid = true
                    }
                    return true;
                }
            },
            nameRules(value) {
                if (value.length === 0) {
                    this.nameIsValid = false;
                    this.formIsValid = false
                    return "Required.";
                } else {
                    this.nameIsValid = true;
                    this.formIsValid = false
                    if (this.dateIsValid && this.hexIsValid && this.nameIsValid && this.startIsValid && this
                        .endIsValid) {
                        this.formIsValid = true
                    }
                    return true;
                }
            },
            startRules(value) {
                const pattern = /^([01]\d|2[0-3]):?([0-5]\d)$/
                var startHappyHourD = new Date();
                var start = this.start.split(':')
                startHappyHourD.setHours(parseInt(start[0]), parseInt(start[1]), 0);
                var endHappyHourD = new Date();
                var end = this.end.split(':')
                endHappyHourD.setHours(parseInt(end[0]), parseInt(end[1]), 0);
                if (value.length === 0) {
                    this.startIsValid = false;
                    this.formIsValid = false
                    return "Required.";
                } else if (!pattern.test(value)) {
                    this.startIsValid = false
                    this.formIsValid = false
                    return 'Invalid time.'
                } else if (endHappyHourD <= startHappyHourD) {
                    this.startIsValid = false
                    this.formIsValid = false
                    return 'End has to be after start.'
                } else if (this.eventCollisionCheck(value)) {
                    this.startIsValid = false
                    this.formIsValid = false
                    return 'There is another event at that time.'
                } else {
                    this.startIsValid = true
                    if (this.dateIsValid && this.hexIsValid && this.nameIsValid && this.startIsValid && this
                        .endIsValid) {
                        this.formIsValid = true
                    }
                    return true;
                }
            },
            endRules(value) {
                const pattern = /^([01]\d|2[0-3]):?([0-5]\d)$/
                var startHappyHourD = new Date();
                var start = this.start.split(':')
                startHappyHourD.setHours(parseInt(start[0]), parseInt(start[1]), 0);
                var endHappyHourD = new Date();
                var end = this.end.split(':')
                endHappyHourD.setHours(parseInt(end[0]), parseInt(end[1]), 0);
                if (value.length === 0) {
                    this.endIsValid = false;
                    this.formIsValid = false
                    return "Required.";
                } else if (!pattern.test(value)) {
                    this.endIsValid = false
                    this.formIsValid = false
                    return 'Invalid time.'
                } else if (endHappyHourD <= startHappyHourD) {
                    this.endIsValid = false
                    this.formIsValid = false
                    return 'End has to be after start.'
                } else if (this.eventCollisionCheck(value)) {
                    this.endIsValid = false
                    this.formIsValid = false
                    return 'There is another event at that time.'
                } else {
                    this.endIsValid = true
                    if (this.dateIsValid && this.hexIsValid && this.nameIsValid && this.startIsValid && this
                        .endIsValid) {
                        this.formIsValid = true
                    }
                    return true;
                }
            },
            eventCollisionCheck(value) {
                var collisionOccured = false
                var newTime = value.split(':')
                var newHappyHourD = new Date();
                newHappyHourD.setHours(parseInt(newTime[0]), parseInt(newTime[1]), 0);

                if (this.events) {
                    this.events.forEach(event => {
                        var start = event.start.split(' ')
                        var end = event.end.split(' ')
                        if (!event.noCollision) {
                            if (this.date.toString() == start[0].toString()) {
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
                }
                return collisionOccured
            }
        },
    }
</script>