<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Registrierung Medication-Master</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="registerForm.name" id="name" prepend-icon="mdi-account" name="name"
                    label="Benutzername" type="text" v-on:keyup.enter="register"></v-text-field>
                  <v-text-field v-model="registerForm.email" id="email" prepend-icon="mdi-account" name="email"
                    label="E-Mail" type="text" v-on:keyup.enter="register"></v-text-field>
                  <v-text-field v-model="registerForm.password" id="password" prepend-icon="mdi-lock" name="password"
                    label="Passwort" type="password" v-on:keyup.enter="register"></v-text-field>
                </v-form>
                <p v-if="error" class="text-center error-message">
                  {{ error }}
                </p>
              </v-card-text>
              <v-card-actions>
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
    updateProfile
  } from "firebase/auth";

  export default {
    data() {
      return {
        registerForm: {
          name: "",
          email: "",
          password: ""
        },
        error: null,
        currentUser: null
      };
    },
    methods: {
      register() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.registerForm.email, this.registerForm.password)
          .then(data => {
            console.log(data.user)
          })
          .catch((err) => {
            this.error = err.message;
            // ..
          });
      }
    }
  };
</script>