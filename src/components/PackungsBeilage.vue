<template>
    <div>
        <v-dialog transition="dialog-top-transition" v-model="show" fullscreen
      hide-overlay>
            <template v-slot:default="dialog">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="dialog.value = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ leaflet.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark text @click="dialog.value = false">
                                Schließen
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-form ref="form" @submit.prevent="submit">
                        <v-card-text>
                            {{ leaflet }}
                        </v-card-text>
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
            leaflet: null,
        },
        data: () => ({}),
        computed: {
            show: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                }
            },
        },
        watch: {},
        methods: {},
    }
</script>