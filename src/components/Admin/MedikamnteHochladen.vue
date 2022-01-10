<template>
    <v-card v-if="rights == 3 || rights == 4" style="display:flex">
        <template>
            <v-file-input v-model="files" multiple label="Medikament(e)"></v-file-input>
            <v-btn id="upload-btn" depressed color="primary" @click.stop="uploadMedicaments">
                Hochladen
            </v-btn>
        </template>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            files: [],
        }),
        computed: {
            rights() {
                return this.$store.getters.getRights
            }
        },
        methods: {
            uploadMedicaments() {
                this.files.forEach(file => {
                    this.$store.dispatch("uploadImage", file);
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