<template>
    <div>
        <v-dialog transition="dialog-top-transition" max-width="600" v-model="show">
            <template v-slot:default="dialog">
                <v-card>
                    <v-toolbar color="primary" dark>Opening from the top</v-toolbar>
                    <v-card-text>
                        <v-row justify="center" align="center">
                            <v-col class="shrink" style="min-width: 220px;">
                                <v-text-field v-model="color" hide-details class="ma-0 pa-0" solo>
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
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="dialog.value = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            value: Boolean
        },
        data: () => ({
            color: '#1976D2FF',
            menu: false,
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
        }
    }
</script>