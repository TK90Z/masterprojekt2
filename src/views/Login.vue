<template>
    <v-app id="inspire">
        <v-main>
            <v-container fluid fill-height v-if="hasAccount">
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Anmeldung Medication-Master</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field v-model="loginForm.email" id="email" prepend-icon="mdi-email"
                                        name="email" label="E-Mail" type="text" v-on:keyup.enter="login"></v-text-field>
                                    <v-text-field v-model="loginForm.password" id="password" prepend-icon="mdi-lock"
                                        name="password" label="Passwort" type="password" v-on:keyup.enter="login">
                                    </v-text-field>
                                </v-form>
                                <p v-if="error" class="text-center error-message">
                                    {{ error }}
                                </p>
                            </v-card-text>
                            <v-card-actions>
                                <v-card-text class="clickable-text" @click.stop="hasAccount=false">Noch kein Konto?
                                </v-card-text>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click.stop="login">Anmelden</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container fluid fill-height v-if="!hasAccount">
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Registrierung Medication-Master</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field v-model="registerForm.name" id="name" prepend-icon="mdi-account"
                                        name="name" label="Benutzername" type="text" v-on:keyup.enter="register">
                                    </v-text-field>
                                    <v-text-field v-model="registerForm.email" id="email" prepend-icon="mdi-email"
                                        name="email" label="E-Mail" type="text" v-on:keyup.enter="register">
                                    </v-text-field>
                                    <v-text-field v-model="registerForm.password" id="password" prepend-icon="mdi-lock"
                                        name="password" label="Passwort" type="password" v-on:keyup.enter="register">
                                    </v-text-field>
                                </v-form>
                                <p v-if="error" class="text-center error-message">
                                    {{ error }}
                                </p>
                            </v-card-text>
                            <v-card-actions>
                                <v-card-text class="clickable-text" @click.stop="hasAccount=true">Ich habe schon ein
                                    Konto!</v-card-text>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click.stop="register">Registrieren</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        updateProfile
    } from "firebase/auth";
    import {
        getFirestore,
        doc, 
        setDoc
    } from "firebase/firestore";

    export default {
        data() {
            return {
                loginForm: {
                    email: "",
                    password: ""
                },
                registerForm: {
                    name: "",
                    email: "",
                    password: ""
                },
                error: null,
                hasAccount: true
            };
        },
        methods: {
            login() {
                const auth = getAuth();
                signInWithEmailAndPassword(auth, this.loginForm.email, this.loginForm.password)
                    .then(data => {
                        console.log(data)
                    })
                    .catch(err => {
                        this.error = err.message;
                    });
            },
            register() {
                const auth = getAuth();
                const db = getFirestore();
                createUserWithEmailAndPassword(auth, this.registerForm.email, this.registerForm.password)
                    .then(data => {
                        updateProfile(auth.currentUser, {
                            displayName: this.registerForm.name,
                            rights: 0
                        }).then(() => {
                            try {
                                setDoc(doc(db, "Rechte", data.user.uid), {
                                    rights: 0
                                });
                            } catch (e) {
                                console.error("Error adding document: ", e);
                            }
                        }).catch((err) => {
                            this.error = err.message;
                            // ..
                        });
                    })
                    .catch((err) => {
                        this.error = err.message;
                        // ..
                    });
            },
        },
    };
</script>
<style>
    .clickable-text {
        cursor: pointer;
        text-decoration: underline;
        color: blue
    }
</style>