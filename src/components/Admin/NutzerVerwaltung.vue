<template>
    <v-card v-if="rights == 3 || rights == 4">
        <v-data-table :headers="headers" :items="users" item-key="uid" sort-by="uid" group-by="rights"
            class="elevation-1" show-group-by>
            <template v-slot:group.header="{items, isOpen, toggle}">
        <th colspan="4">
          <v-icon @click="toggle"
            >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
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
                <v-icon small class="mr-2" @click="item.editMode = false" v-if="item.editMode">
                    mdi-cancel
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:item.name="{ item }">
                <v-text-field v-model="item.name" placeholder="Name" :disabled="!item.editMode"></v-text-field>
            </template>
            <template v-slot:item.rightsAutocomplete="{ item }">
                <v-autocomplete v-model="item.editRights" :items="rechte" dense label="Rechte" item-text="text"
                    item-value="index" :disabled="autoDisable(item)"></v-autocomplete>
            </template></v-data-table>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
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
                ]
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
            }
        },
        methods: {
            autoDisable(item){
                if(item.editRights > this.rights) {
                    return true
                } else if (item.editMode == false) {
                    return true
                } else {
                    return false
                }
            },
            saveItem(item) {
                const name = item.name
                const rights = item.editRights
                const uid = item.uid
                console.log(name, rights, uid)
                this.$store.dispatch("updateUser", {
                    name: name,
                    rights: rights,
                    uid: uid,
                })
            }
        },
    }
</script>