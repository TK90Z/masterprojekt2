<template>
    <v-card v-if="rights == 2 || rights == 4" >
        <v-tabs v-model="tab" background-color="transparent" centered icons-and-text>
            <v-tabs-slider></v-tabs-slider>
            <v-tab @click="tab = 0" class="home-custom-tab">
                <div>
                    <v-icon left>mdi-calendar-edit</v-icon>
                    Terminliste
                </div>                
            </v-tab>
            <v-tab @click="tab = 1" class="home-custom-tab">
                <div>
                    <v-icon left>mdi-calendar-check</v-icon>
                    Termine bestaetigen
                </div>                
            </v-tab>
        </v-tabs>

        <div class="tab-item-spacer"></div>
        <v-tabs-items v-model="tab">
            <v-tab-item :key=0>
                <v-card flat class="home-tab-outer-wrapper">
                    <v-card flat>
                        <div class="basic-config-wrapper">
                            <TerminKalender />
                        </div>
                    </v-card>
                </v-card>
            </v-tab-item>
            <v-tab-item :key=1>
                <v-card flat class="home-tab-outer-wrapper">
                    <v-card flat>
                        <BestaetigungKalender />
                    </v-card>
                </v-card>
            </v-tab-item>
        </v-tabs-items>

    </v-card>
    <NotAvailable v-else />
</template>



<script>
    import BestaetigungKalender from "./Kalender/BestaetigungKalender"
    import TerminKalender from "./Kalender/TerminKalender"
    import NotAvailable from "../../components/NotAvailable"
    export default {
        data() {
            return {
                tab: 0,
                newLogo: false,
            }
        },
        created() {
            this.$store.dispatch("fetchUnconfirmedEvents", {ownUid: this.$store.getters.getUID, targetUid: this.$store.getters.getUID});
            this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
        },
        props: {
            value: Boolean,
            editItem: null,
        },
        components: {
            BestaetigungKalender,
            NotAvailable,
            TerminKalender
        },
        computed: {
            rights() {
                return this.$store.getters.getRights
            },
            unconfirmedEvents(){
                return this.$store.getters.getOwnUnconfirmedEvents
            }
        },
    }
</script>

<style scoped>
    .home-custom-tab {
        color: black !important
    }
</style>
<style>
    .v-tabs-slider-wrapper {
        color: #007BFF;
        height: 4px !important;
    }
</style>