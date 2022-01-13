<template>
    <v-card v-if="rights == 3 || rights == 4" style="display:flex">
        <template>
            <v-container>
                <v-row>
                    <v-file-input v-model="medicamentJson" accept=".json, application/json" label="Json auswählen">
                    </v-file-input>
                    <v-file-input v-model="medicamentImage" accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera" label="Bild auswählen"></v-file-input>
                </v-row>
                <v-row>
                    <div style="display:flex; width:100%">
                        <v-btn style="margin-left:auto; margin-bottom:15px" id="upload-btn" depressed color="primary"
                            @click.stop="uploadMedicaments">
                            Hochladen
                        </v-btn>
                    </div>
                </v-row>
            </v-container>
        </template>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            medicamentJson: null,
            medicamentImage: null,
        }),
        computed: {
            rights() {
                return this.$store.getters.getRights
            }
        },
        methods: {
            uploadMedicaments() {
                this.$store.dispatch("readMedicaments", {
                    json: this.medicamentJson,
                    image: this.medicamentImage
                });
            }
        },
    }
</script>

<style>
    #upload-btn {
        margin-top: auto;
        margin-left: 20px;
    }
</style>