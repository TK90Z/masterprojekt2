<template>
    <v-container fluid v-if="rights == 2 || rights == 4">
        <v-data-iterator :items="ownPatients" :items-per-page.sync="itemsPerPage" :page.sync="page" :search="search"
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
        <v-dialog v-model="addDiagnosisDialog" transition="dialog-top-transition" max-width="600" width="400">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Neue Diagnose erstellen</v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="newDiagnosis.date" :value="today" readonly label="Erstellungsdatum">Bla
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.name" :value="myCredentials.displayName" readonly
                            label="Name des Erstellers">Bla
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.email" :value="myCredentials.email" readonly
                            label="Mail des Erstellers">Bla
                        </v-text-field>
                        <v-text-field v-model="newDiagnosis.diagnosis" label="Diagnose">Bla</v-text-field>
                        <v-text-field v-model="newDiagnosis.symptoms" label="Symptome">Bla</v-text-field>
                        <v-text-field v-model="newDiagnosis.medications" label="Medikation">Bla</v-text-field>
                        <v-textarea v-model="newDiagnosis.details" label="Beschreibung"></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn @click="uploadDiagnosis" text>Abschicken</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="inspectDiagnosisDialog" transition="dialog-top-transition" max-width="1000" width="800"
            persistent>
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Neue Diagnose erstellen</v-toolbar>
                    <v-card-text>
                        <v-card-text class="pt-4">
                            <v-text-field v-model="diagnosisSearch" label="Suche">Bla</v-text-field>
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
                                        <v-list-item-title>{{ item.medications }}</v-list-item-title>
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
                        <v-text-field v-model="openedDiagnosis.date" :value="today" readonly label="Erstellungsdatum">Bla
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.name" :value="myCredentials.displayName" readonly
                            label="Name des Erstellers">Bla
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.email" :value="myCredentials.email" readonly
                            label="Mail des Erstellers">Bla
                        </v-text-field>
                        <v-text-field v-model="openedDiagnosis.diagnosis" label="Diagnose" readonly>Bla</v-text-field>
                        <v-text-field v-model="openedDiagnosis.symptoms" label="Symptome" readonly>Bla</v-text-field>
                        <v-text-field v-model="openedDiagnosis.medications" label="Medikation" readonly>Bla</v-text-field>
                        <v-textarea v-model="openedDiagnosis.details" label="Beschreibung" readonly></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn @click="openDiagnosisDialog = false" text>Schließen</v-btn>
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
                diagnosisSearch: "",
                newDiagnosis: {
                    date: null,
                    name: null,
                    email: null,
                    diagnosis: null,
                    symptoms: null,
                    medications: null,
                    details: null,
                },
                openedDiagnosis: {
                    date: null,
                    name: null,
                    email: null,
                    diagnosis: null,
                    symptoms: null,
                    medications: null,
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
                keys: [
                    'Name',
                    'Calories',
                    'Fat',
                    'Carbs',
                    'Protein',
                    'Sodium',
                    'Calcium',
                    'Iron',
                ],
            }
        },
        components: {
            NotAvailable,
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
            }
        },
        watch: {
            ownPatients(ownPatients) {
                this.$store.dispatch("loadOwnPatientsImages", ownPatients);
            },
            diagnosisSearch(search){
                var newArray = []
                this.diagnosisArray.forEach(element => {
                    if(element.date.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                    else if(element.name.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                    else if(element.email.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                    else if(element.diagnosis.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                    else if(element.symptoms.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                    else if(element.medications.toLowerCase().includes(search.toLowerCase()))
                    newArray.push(element)
                });
                this.searchedDiagnosisArray = newArray
            }
        },
        mounted() {
            this.$store.dispatch("fetchOwnPatients", this.$store.getters.getUID);
        },
        methods: {
            openDiagnosis(item) {
                console.log(item)
                this.openedDiagnosis = item
                this.openDiagnosisDialog = true
            },
            addDiagnosis(uid) {
                this.diagnosisForUid = uid
                this.newDiagnosis = {
                    date: this.today,
                    name: this.myCredentials.displayName,
                    email: this.myCredentials.email,
                    diagnosis: null,
                    symptoms: null,
                    medications: null,
                    details: null,
                }
                this.addDiagnosisDialog = true
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