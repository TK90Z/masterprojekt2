<template>
    <v-card v-if="rights == 1 || rights == 4">
        <v-tabs v-model="tab" background-color="transparent" centered icons-and-text>
            <v-tabs-slider></v-tabs-slider>
            <v-tooltip bottom>
                <span>Tooltip </span>
                <template v-slot:activator="{ on }">
                    <v-tab ripple v-on="on" @click="tab = 0" class="home-custom-tab" style="margin-left: auto;">
                        <div>Eigene Termine</div>
                        <v-icon>mdi-calendar</v-icon>
                    </v-tab>
                </template>
            </v-tooltip>
            <v-tooltip bottom>
                <span>Tooltip </span>
                <template v-slot:activator="{ on }">
                    <v-tab ripple v-on="on" @click="tab = 1" class="home-custom-tab">
                        <div>Termin buchen</div>
                <v-icon>mdi-calendar-edit</v-icon>
                    </v-tab>
                </template>
            </v-tooltip>
            <v-tooltip bottom>
                <span>Tooltip </span>
                <template v-slot:activator="{ on }">
                    <v-tab ripple v-on="on" @click="tab = 2" class="home-custom-tab" style="margin-right: auto;">
                        <v-badge v-if="unconfirmedEvents.length > 0" :content="unconfirmedEvents.length">Unbestaetigte Termine
                </v-badge>
                <div v-else>Unbestaetigte Termine</div>
                <v-icon>mdi-calendar-question</v-icon>
                    </v-tab>
                </template>
            </v-tooltip>
        </v-tabs>

        <div class="tab-item-spacer"></div>
        <v-tabs-items v-model="tab">
            <v-tab-item :key=0>
                <v-card flat class="home-tab-outer-wrapper">
                    <v-card flat>
                        <div class="basic-config-wrapper">
                            <EigenerKalender />
                        </div>
                    </v-card>
                </v-card>
            </v-tab-item>
            <v-tab-item :key=1>
                <v-card flat class="home-tab-outer-wrapper">
                    <v-card flat>
                        <BuchungKalender />
                    </v-card>
                </v-card>
            </v-tab-item>
            <v-tab-item :key=2>
                <v-card flat class="home-tab-outer-wrapper">
                    <v-card flat>
                        <div class="basic-config-wrapper">
                            <UnbestaetigtKalender />
                        </div>
                    </v-card>
                </v-card>
            </v-tab-item>
        </v-tabs-items>

    </v-card>
    <NotAvailable v-else />
</template>



<script>
    import EigenerKalender from "./Kalender/EigenerKalender"
    import BuchungKalender from "./Kalender/BuchungKalender"
    import UnbestaetigtKalender from "./Kalender/UnbestaetigtKalender"
    import NotAvailable from "../../components/NotAvailable"
    export default {
        data() {
            return {
                tab: 0,
                newLogo: false,
            }
        },
        created() {
            this.$store.dispatch("fetchUnconfirmedEvents", {
                ownUid: this.$store.getters.getUID,
                targetUid: this.$store.getters.getUID
            });
            this.$store.dispatch("fetchOwnEvents", this.$store.getters.getUID);
        },
        props: {
            value: Boolean,
            editItem: null,
        },
        components: {
            EigenerKalender,
            NotAvailable,
            BuchungKalender,
            UnbestaetigtKalender
        },
        computed: {
            rights() {
                return this.$store.getters.getRights
            },
            unconfirmedEvents() {
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