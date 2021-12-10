<template>
    <v-card v-if="rights == 1 || rights == 4">
        <v-tabs v-model="tab" background-color="transparent" centered dark icons-and-text>
            <v-tabs-slider></v-tabs-slider>
            <v-tab @click="tab = 0" class="home-custom-tab">
                Eigene Termine
                <!--<v-icon>mdi-phone</v-icon>-->
            </v-tab>
            <v-tab @click="tab = 1" class="home-custom-tab">
                Termin buchen
                <!--<v-icon>mdi-heart</v-icon>-->
            </v-tab>
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
                        <FremderKalender />
                    </v-card>
                </v-card>
            </v-tab-item>
        </v-tabs-items>

    </v-card>
    <NotAvailable v-else />
</template>



<script>
    import EigenerKalender from "./Kalender/EigenerKalender"
    import FremderKalender from "./Kalender/FremderKalender"
    import NotAvailable from "../../components/NotAvailable"
    export default {
        data() {
            return {
                tab: 0,
                newLogo: false,
            }
        },
        props: {
            value: Boolean,
            editItem: null,
        },
        components: {
            EigenerKalender,
            NotAvailable,
            FremderKalender,
        },
        computed: {
            rights() {
                return this.$store.getters.getRights
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