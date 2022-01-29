<template>
    <v-container fluid v-if="rights == 2 || rights == 4">
        <v-data-iterator :items="ownPatients" :items-per-page.sync="itemsPerPage" :page.sync="page" :search="search"
            :sort-by="sortBy.toLowerCase()" :sort-desc="sortDesc" hide-default-footer>
            <template v-slot:header>
                <v-toolbar dark color="blue darken-3" class="mb-1">
                    <v-text-field rounded="xl" v-model="search" clearable flat solo-inverted hide-details
                        prepend-inner-icon="mdi-magnify" label="Suche"></v-text-field>
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-spacer></v-spacer>
                        <div class="alpha-sort" > Alphabetisch sortieren: </div>
                        <v-btn-toggle v-model="sortDesc" mandatory>
                        <v-tooltip v-model="show" bottom>
                            <template v-slot:activator="{ on }">
                             <v-btn v-on="on" elevation="3" small depressed color="blue" :value="false">
                             <v-icon small>mdi-arrow-up</v-icon>
                         </v-btn>
                         </template>
                         <span>aufsteigend</span>
                        </v-tooltip>
                        <v-tooltip v-model="show" bottom>
                         <template v-slot:activator="{ on }">
                             <v-btn v-on="on" elevation="3" small depressed color="blue" :value="true">
                              <v-icon small>mdi-arrow-down</v-icon>
                             </v-btn>
                            </template>
                            <span>absteigend</span>
                         </v-tooltip>
                        </v-btn-toggle>
                    </template>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-row>
                    <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                        <v-card id="v-card" style="height:100%">
                            <div
                                style="display:flex; width:100%; margin: 0px; min-width:300px; min-height:300px; padding:10px">
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
                                        Alter:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end">
                                        {{ item.age }}
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        Geschlecht:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end">
                                        {{ item.sex }}
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        Versicherung:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end">
                                        {{ item.insurance }}
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <div style="width:100%; display:flex;justify-content:space-between">
                                <v-avatar color="primary" style="margin:10px; cursor:pointer"
                                    @click="addDiagnosis(item.uid)">
                                    <v-icon dark>
                                        mdi-clipboard-edit-outline
                                    </v-icon>
                                </v-avatar>
                                <v-avatar color="primary" style="margin:10px; cursor:pointer"
                                    @click="inspectDiagnosis(item)">
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
                    <span class="grey--text items-per-page">Items per page:</span>
                    <v-menu offset-y top rounded="lg">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn rounded="lg" dark text color="primary" class="ml-2 items-per-page" v-bind="attrs" v-on="on">
                                {{ itemsPerPage }}
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list rounded="lg" class="text-center">
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
                    <v-btn small fab dark color="blue darken-3" class="mr-1 page-buttons" @click="formerPage">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn small fab dark color="blue darken-3" class="ml-1 page-buttons" @click="nextPage">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </template>
        </v-data-iterator>
        <v-dialog v-model="addDiagnosisDialog" transition="dialog-top-transition" max-width="600" width="400">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Neue Diagnose erstellen</v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="newDiagnosis.date" :value="today" readonly label="Erstellungsdatum">
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.name" :value="myCredentials.displayName" readonly
                            label="Name des Erstellers">
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.email" :value="myCredentials.email" readonly
                            label="Mail des Erstellers">
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.diagnosis" label="Diagnose"></v-text-field>
                        <v-text-field v-model="newDiagnosis.symptoms" label="Symptome"></v-text-field>
                        <v-select v-model="medicationsHolder" :items="medicaments" item-text="name" item-value="id"
                            :menu-props="{ maxHeight: '400' }" label="Medikation" multiple
                            hint="Wählen sie die Medikament(e) aus" persistent-hint></v-select>
                        <v-textarea v-model="newDiagnosis.details" label="Beschreibung"></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="symptomsIsEmpty" @click="medicationDetails" text>Abschicken</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="inspectDiagnosisDialog" transition="dialog-top-transition" max-width="1000" width="800">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Neue Diagnose erstellen</v-toolbar>
                    <v-card-text>
                        <v-card-text class="pt-4">
                            <v-text-field v-model="diagnosisSearch" label="Suche"></v-text-field>
                        </v-card-text>

                        <v-divider></v-divider>
                        <v-virtual-scroll :items="searchedDiagnosisArray" :item-height="50" height="300"
                            :search="diagnosisSearch">
                            <template v-slot:default="{ item }">
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.date }}</v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.symptoms }}</v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ medicationsAsString(item.medications) }}
                                        </v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn small @click="openDiagnosis(item)">
                                            Öffnen

                                            <v-icon color="orange darken-4" right>
                                                mdi-open-in-new
                                            </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </template>
                        </v-virtual-scroll>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn @click="inspectDiagnosisDialog = false" text>Schließen</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="openDiagnosisDialog" transition="dialog-top-transition" max-width="600" width="400">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Neue Diagnose erstellen</v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="openedDiagnosis.date" :value="today" readonly label="Erstellungsdatum">
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.name" :value="myCredentials.displayName" readonly
                            label="Name des Erstellers">
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.email" :value="myCredentials.email" readonly
                            label="Mail des Erstellers">
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.diagnosis" label="Diagnose" readonly></v-text-field>
                        <v-text-field v-model="openedDiagnosis.symptoms" label="Symptome" readonly></v-text-field>
                        <v-text-field :value="medicationsAsString(openedDiagnosis.medications)" label="Medikation"
                            readonly></v-text-field>
                        <v-textarea v-model="openedDiagnosis.details" label="Beschreibung" readonly></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn @click="openDiagnosisDialog = false" text>Schließen</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="medicationDialog" transition="dialog-top-transition" max-width="600" width="400" persistent>
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>{{ newMedicament.name }}</v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="newMedicament.amount" label="Einnahmemenge">
                        </v-text-field>
                        <v-text-field v-model="newMedicament.period" label="Dauer in Tagen">
                        </v-text-field>
                        <v-text-field v-model="newMedicament.frequency" label="Häufigkeit">
                        </v-text-field>
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="newMedicament.start" label="Beginn" prepend-icon="mdi-calendar"
                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="newMedicament.start" :active-picker.sync="activePicker"
                                :min="(new Date(Date.now() + (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                @change="save"></v-date-picker>
                        </v-menu>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn @click="medicationDetails" text :disabled="allSet">Fertig</v-btn>
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
                activePicker: null,
                menu: false,
                medicationDialog: false,
                arrayIndex: 0,
                medicationsHolder: [],
                newMedicament: {
                    id: null,
                    name: null,
                    amount: null,
                    period: null,
                    frequency: null,
                    start: null
                },
                defaultMedicament: {
                    id: null,
                    amount: null,
                    period: null,
                    frequency: null,
                    start: null
                },
                diagnosisSearch: "",
                newDiagnosis: {
                    date: null,
                    name: null,
                    email: null,
                    diagnosis: null,
                    symptoms: null,
                    medications: [],
                    details: null,
                },
                openedDiagnosis: {
                    date: null,
                    name: null,
                    email: null,
                    diagnosis: null,
                    symptoms: null,
                    medications: [],
                    details: null,
                },
                diagnosisArray: null,
                searchedDiagnosisArray: [],
                diagnosisForUid: null,
                addDiagnosisDialog: false,
                inspectDiagnosisDialog: false,
                openDiagnosisDialog: false,
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
            NotAvailable
        },
        computed: {
            numberOfPages() {
                return Math.ceil(this.ownPatients.length / this.itemsPerPage)
            },
            filteredKeys() {
                return this.keys.filter(key => key !== 'Name')
            },
            ownPatients() {
                return this.$store.getters.getOwnPatients
            },
            rights() {
                return this.$store.getters.getRights;
            },
            today() {
                var today = new Date();
                return today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear()
            },
            myCredentials() {
                console.log(this.$store.getters.getUser)
                return this.$store.getters.getUser
            },
            medicaments() {
                return this.$store.getters.getMedicaments
            },
            allSet() {
                if (this.newMedicament.amount && this.newMedicament.period && this.newMedicament.frequency && this
                    .newMedicament.start) {
                    return false
                } else {
                    return true
                }
            },
            symptomsIsEmpty() {
                return (!this.newDiagnosis.symptoms || this.newDiagnosis.symptoms == "")
            },
        },
        watch: {
            ownPatients(ownPatients) {
                this.$store.dispatch("loadOwnPatientsImages", ownPatients);
            },
            diagnosisSearch(search) {
                var newArray = []
                this.diagnosisArray.forEach(element => {
                    if (element.date.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                    else if (element.name.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                    else if (element.email.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                    else if (element.diagnosis.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                    else if (element.symptoms.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                    else if (element.medications.toLowerCase().includes(search.toLowerCase()))
                        newArray.push(element)
                });
                this.searchedDiagnosisArray = newArray
            }
        },
        mounted() {
            this.$store.dispatch("fetchOwnPatients", this.$store.getters.getUID);
            this.$store.dispatch("fetchMedicaments");
        },
        methods: {
            save(date) {
                this.$refs.menu.save(date)
            },
            medicationsAsString(medications) {
                var medicationString = ""
                medications.forEach(medication => {
                    const found = this.medicaments.find(element => element.id == medication.id);
                    if (found) {
                        if (medicationString != "") {
                            medicationString = medicationString + ", "
                        }
                        medicationString = medicationString + found.name
                    }
                })
                return medicationString
            },
            openDiagnosis(item) {
                console.log(item)
                this.openedDiagnosis = item
                this.openDiagnosisDialog = true
            },
            addDiagnosis(uid) {
                this.arrayIndex = 0
                this.medicationsHolder = []
                this.diagnosisForUid = uid
                this.newDiagnosis = {
                    date: this.today,
                    name: this.myCredentials.displayName,
                    email: this.myCredentials.email,
                    diagnosis: null,
                    symptoms: null,
                    medications: [],
                    details: null,
                }
                this.addDiagnosisDialog = true
            },
            medicationDetails() {
                if (this.newMedicament.amount) {
                    this.newDiagnosis.medications.push(this.newMedicament)
                    this.newMedicament = this.defaultMedicament
                }
                this.medicationDialog = false
                if (this.medicationsHolder[this.arrayIndex]) {
                    var found = this.medicaments.find(element => element.id == this.medicationsHolder[this.arrayIndex]);
                    this.newMedicament.name = found.name
                    this.newMedicament.id = found.id
                    this.medicationDialog = true
                } else {
                    this.uploadDiagnosis()
                }
                this.arrayIndex++
            },
            uploadDiagnosis() {
                this.$store.dispatch("addNewDiagnosis", {
                    newDiagnosis: this.newDiagnosis,
                    uid: this.diagnosisForUid
                })
                this.addDiagnosisDialog = false
            },
            inspectDiagnosis(item) {
                console.log(item)
                this.diagnosisArray = item.diagnosis
                this.searchedDiagnosisArray = item.diagnosis
                this.inspectDiagnosisDialog = true
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