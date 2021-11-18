<template>
   <v-app id="inspire">
      <v-main>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Anmeldung Medication-Master</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field v-model="loginForm.email" id="email" prepend-icon="mdi-account" name="email"
                              label="E-Mail" type="text" v-on:keyup.enter="login"></v-text-field>
                           <v-text-field v-model="loginForm.password" id="password" prepend-icon="mdi-lock" name="password"
                              label="Passwort" type="password" v-on:keyup.enter="login"></v-text-field>
                        </v-form>
                        <p v-if="error" class="text-center error-message">
                           {{ error }}
                        </p>
                     </v-card-text>
                     <v-card-actions>
                        <v-card-text @click.stop="login">Noch kein Konto</v-card-text>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click.stop="login">Anmelden</v-btn>
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
      signInWithEmailAndPassword
   } from "firebase/auth";

   export default {
      data() {
         return {
            loginForm: {
               email: "",
               password: ""
            },
            error: null
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
         }
      }
   };
</script>