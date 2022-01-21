<template>
    <v-card v-if="rights == 3 || rights == 4">
        <v-data-table :headers="headers" :items="users" item-key="uid" sort-by="uid" group-by="rights"
            class="elevation-1" show-group-by>
            <template v-slot:group.header="{items, isOpen, toggle}">
                <th colspan="4">
                    <v-icon @click="toggle">{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                    </v-icon>
                    {{ rechte[items[0].editRights].text }}
                </th>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="item.editMode = true" v-if="!item.editMode">
                    mdi-pencil
                </v-icon>
                <v-icon small class="mr-2" @click="saveItem(item)" v-if="item.editMode">
                    mdi-floppy
                </v-icon>
                <v-icon small class="mr-2" @click="stopEditMode(item)" v-if="item.editMode">
                    mdi-cancel
                </v-icon>
                <v-icon small @click="askForDelete(item)" v-if="rights == 4">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:item.name="{ item }">
                <v-text-field v-model="item.editName" placeholder="Name" :disabled="!item.editMode"></v-text-field>
            </template>
            <template v-slot:item.rightsAutocomplete="{ item }">
                <v-autocomplete v-model="item.editRights" @change="editRightsChanged(item)" :items="rechte" dense
                    label="Rechte" item-text="text" item-value="index" :disabled="autoDisable(item)">
                </v-autocomplete>
            </template></v-data-table>
        <v-dialog v-model="subjectAreaDialog" transition="dialog-top-transition" max-width="600" persistent>
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Bitte wählen sie eine Fachrichtung aus.</v-toolbar>
                    <v-card-text>
                        <v-select v-model="subjectAreaItems" :items="subjectAreas" item-text="text" item-value="index"
                            :menu-props="{ maxHeight: '400' }" multiple
                            hint="Wählen sie die Fachrichtung(en) aus" persistent-hint></v-select>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="changeSubjectArea">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="patientCredentialsDialog" transition="dialog-top-transition" max-width="600" persistent>
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Bitte tragen sie weitere Informationen zum Patienten ein.
                    </v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="patientCredentials.age" label="Alter"></v-text-field>
                        <v-select v-model="patientCredentials.sex" :items="sexes" :menu-props="{ maxHeight: '400' }"
                            label="Select" hint="Geschlecht" persistent-hint></v-select>
                        <v-text-field v-model="patientCredentials.insurance" label="Versicherung"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="changePatientCredentials">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="deleteDialog" transition="dialog-top-transition" max-width="600">
            <template>
                <v-card>
                    <v-toolbar color="primary" dark>Nutzer löschen</v-toolbar>
                    <v-card-text>
                        Wollen Sie diesen Nutzer wirklich löschen?
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="deleteUser">Löschen</v-btn>
                        <v-btn text @click="deleteDialog = false">Abbrechen</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                deleteDialog: false,
                deleteItem: null,
                subjectAreaDialog: false,
                subjectAreaItems: null,
                patientCredentialsDialog: false,
                patientCredentials: {
                    age: null,
                    sex: null,
                    insurance: null
                },
                sexes: [
                    "Männlich",
                    "Weiblich"
                ],
                headers: [{
                        text: 'Name',
                        align: 'start',
                        value: 'name',
                        groupable: false,
                    },
                    {
                        text: 'Rechte',
                        value: 'rights',
                        align: 'center'
                    },
                    {
                        text: 'UID',
                        value: 'uid',
                        align: 'center',
                        groupable: false,
                    },
                    {
                        text: 'Rechte',
                        value: 'rightsAutocomplete',
                        align: 'center',
                        groupable: false,
                    },
                    {
                        text: 'Actions',
                        value: 'actions',
                        align: 'right',
                        groupable: false,
                    },
                ],
                rechte: [{
                        index: 0,
                        text: "Nicht Verifiziert"
                    },
                    {
                        index: 1,
                        text: "Patient"
                    },
                    {
                        index: 2,
                        text: "Arzt"
                    },
                    {
                        index: 3,
                        text: "Admin"
                    },
                    {
                        index: 4,
                        text: "Superadmin",
                        disabled: true
                    },
                ],
            }
        },
        mounted() {
            this.$store.dispatch("fetchUsers")
        },
        computed: {
            rights() {
                return this.$store.getters.getRights
            },
            users() {
                return this.$store.getters.getUsers
            },
            subjectAreas() {
                return this.$store.getters.getSubjectAreas
            }
        },
        methods: {
            changePatientCredentials() {
                if (this.patientCredentials.age && this.patientCredentials.sex && this.patientCredentials.insurance) {
                    this.patientCredentialsDialog = false
                }
            },
            stopEditMode(item) {
                item.editMode = false,
                    item.editRights = item.rights
                item.editName = item.name
            },
            changeSubjectArea() {
                if (this.subjectAreaItems) {
                    this.subjectAreaDialog = false
                }
            },
            editRightsChanged(item) {
                if (item.editRights == 2) {
                    this.subjectAreaItems = item.subjectArea
                    this.subjectAreaDialog = true
                }
                if (item.editRights == 1) {
                    this.patientCredentials = {
                        age: item.age,
                        sex: item.sex,
                        insurance: item.insurance
                    }
                    this.patientCredentialsDialog = true
                }
            },
            autoDisable(item) {
                if (item.editRights > this.rights) {
                    return true
                } else if (item.editMode == false) {
                    return true
                } else {
                    return false
                }
            },
            askForDelete(item) {
                console.log(item)
                this.deleteItem = item
                this.deleteDialog = true
                console.log(this.deleteDialog)
            },
            deleteUser() {
                const uid = this.deleteItem.uid
                this.$store.dispatch("deleteUser", uid)
                this.deleteDialog = false
            },
            saveItem(item) {
                const name = item.editName
                const rights = item.editRights
                const uid = item.uid
                const subjectArea = this.subjectAreaItems
                const credentials = this.patientCredentials
                this.$store.dispatch("updateUser", {
                    name: name,
                    rights: rights,
                    uid: uid,
                    subjectArea: subjectArea,
                    credentials: credentials
                })
            }
        },
    }
</script>