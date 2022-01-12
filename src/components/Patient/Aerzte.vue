<template>
    <v-container fluid v-if="rights == 1 || rights == 4">
        <v-data-iterator :items="allDoctors" :items-per-page.sync="itemsPerPage" :page.sync="page" :search="search"
            :sort-by="sortBy.toLowerCase()" :sort-desc="sortDesc" hide-default-footer>
            <template v-slot:header>
                <v-toolbar dark color="blue darken-3" class="mb-1">
                    <v-text-field v-model="search" clearable flat solo-inverted hide-details
                        prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
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
                        <v-card>
                            <div style="display:flex; width:100%; margin: 0px">
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
                                        Fachrichtung(en):
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end">
                                        {{ item.subjectAreaString }}
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-rating color="primary" half-increments length="5" readonly :size="ratingSize"
                                :value="item.avgRating">
                            </v-rating>
                            <p v-if="notMyDoctor(item.patients)" class="clickable-text"
                                @click="startRateDialog(item)">Bewertung abgeben</p>
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
        <v-dialog v-model="rateDoctorDialog" transition="dialog-top-transition" max-width="600">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Bitte wählen sie eine Fachrichtung aus.</v-toolbar>
                    <v-card-text>
                        <v-rating v-model="rateDoctorValue" color="primary" half-increments length="5" hover size="64"
                            :value="rateDoctorValue">
                        </v-rating>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="rateDoctor">Abschicken</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-container>
    <NotAvailable v-else />
</template>

<script>
    import NotAvailable from "../../components/NotAvailable";
    export default {
        data() {
            return {
                rateDoctorDialog: false,
                rateDoctorUid: null,
                rateDoctorValue: 0,
                windowWidth: window.innerWidth,
                ratingSize: 40,
                itemsPerPageArray: [4, 8, 12],
                search: '',
                filter: {},
                sortDesc: false,
                page: 1,
                itemsPerPage: 4,
                sortBy: 'name',
            }
        },
        components: {
            NotAvailable,
        },
        computed: {
            numberOfPages() {
                return Math.ceil(this.allDoctors.length / this.itemsPerPage)
            },
            allDoctors() {
                return this.$store.getters.getAllDoctors
            },
            subjectAreas() {
                return this.$store.getters.getSubjectAreas
            },
            rights() {
                return this.$store.getters.getRights;
            },
        },
        watch: {
            allDoctors(allDoctors) {
                this.$store.dispatch("loadAllDoctorsImages", allDoctors);
            },
            windowWidth(width) {
                console.log(width)
                if (width < 595) {
                    this.ratingSize = 64
                }
                if (width < 430) {
                    this.ratingSize = 50
                }
                if (width < 360) {
                    this.ratingSize = 40
                }
                if (width < 310) {
                    this.ratingSize = 30
                }
                if (width > 310) {
                    this.ratingSize = 40
                }
                if (width > 430) {
                    this.ratingSize = 50
                }
                if (width > 595) {
                    this.ratingSize = 40
                }
                if (width > 700) {
                    this.ratingSize = 50
                }
            }
        },
        mounted() {
            this.$store.dispatch("fetchAllDoctors", this.$store.getters.getUID);
            this.$nextTick(() => {
                window.addEventListener('resize', this.onResize);
            })
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
        },
        methods: {
            notMyDoctor(patients) {
                var isPatient = false
                if (patients) {
                    patients.forEach(patient => {
                        if (patient == this.$store.getters.getUID) {
                            isPatient = true
                        }
                    })
                    return isPatient
                } else
                    return false
            },
            startRateDialog(item){
                this.rateDoctorUid = item.uid
                this.rateDoctorDialog = true
            },
            rateDoctor() {
                this.$store.dispatch("rateDoctor", {value: this.rateDoctorValue, uids: { docUid: this.rateDoctorUid, myUid: this.$store.getters.getUID}});
                this.rateDoctorDialog = false
            },
            onResize() {
                this.windowWidth = window.innerWidth
            },
            subjectAreasAsString(subjectAreas) {
                var subjectAreaString = ""

                subjectAreas = JSON.parse(JSON.stringify(subjectAreas))

                console.log(subjectAreas)

                if (subjectAreas) {
                    subjectAreas.array.forEach(subjectArea => {
                        subjectAreaString = subjectAreaString + this.subjectAreas[subjectArea]
                    });
                }
                return subjectAreaString
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

<style scoped>
    .clickable-text {
        cursor: pointer;
        text-decoration: underline;
        color: blue;
        margin: 10px
    }
</style>