<template>
    <v-container align="center" justify="center">
        <v-snackbar location="top" color="error" v-model="alert">
            Could not create an account  
                <v-btn
                    color="background"
                    variant="text"
                    @click="alert = false"
                >
                    Close
                </v-btn>
        </v-snackbar>
        <v-card width="400" class="mx-auto ma-9">
                <v-toolbar color="primary" theme="dark" flat>
                    <v-toolbar-title class="text-h6 text-background" id="signup-title"> Signup </v-toolbar-title>
                    <v-spacer/>
                </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field 
                        class="text-body-1"
                        id="signup-email-field"
                        label="Email"
                        :error-messages="emailErrors"
                        name="email" 
                        prepend-icon="mdi-email" 
                        type="email"
                        v-model="signupData.email"
                        required
                        @blur="v$.signupData.email.$touch()"
/>
                    <v-text-field 
                        class="text-body-1"
                        id="signup-password-field"
                        label="Password" 
                        :error-messages="passwordErrors"
                        type="password" 
                        name="password" 
                        prepend-icon="mdi-lock"
                        v-model="signupData.password" 
                        required
                        @input="v$.signupData.password.$touch()"/>
                    <v-text-field 
                        class="text-body-1"
                        id="signup-repeat-password-field"
                        type="password" 
                        :error-messages="repeatPasswordErrors"
                        label="Repeat Password" 
                        name="repeat password" 
                        prepend-icon="mdi-repeat"
                        v-model="signupData.repeatPassword"
                        required
                        @input="v$.signupData.repeatPassword.$touch()" />
                </v-form>
                        <p id="login-redirect-text" class="text-body-1 text-center"> Already have an account? 
                            <router-link to="/login"> 
                                <span class="text-secondary" id="login-redirect">
                                     Login 
                                </span> 
                            </router-link>
                        </p>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-spacer/>
                <v-btn id="signup-user" color="primary" v-on:click="signupUser()">Signup</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, minLength, email } from "@vuelidate/validators";
import { useUserStore } from "@/stores/useUserStore"

export default {
    name: "SignupCard",
    setup() {
        const userStore = useUserStore()
        return { 
            v$: useVuelidate(),
            userStore
        }
    },
    data() {
        return {
            signupData: {
                email: "",
                password:"",
                repeatPassword:""
                
            },
            alert: false
        };
    }, 
    validations() {
        return {
            signupData: {
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8)
                },
                repeatPassword: {
                    required,
                    sameAsPassword: sameAs(this.signupData.password)
                }
            }
        }
    },
    methods : {
        signupUser() {
            this.v$.$touch();
            if (this.v$.$invalid) {
                return;
            }
            let data = {
                email: this.signupData.email,
                password: this.signupData.password
            };
            this.userStore.signup(data)
            .then(() => {
                this.$router.push('/')
                this.$router.go();
            })
            .catch(err => this.alert= true)
        }
    }, computed: {
        emailErrors() {
            const errors = [];
            if (!this.v$.signupData.email.$dirty) return errors;
            !this.v$.signupData.email.email.$response && errors.push("Must be a valid email");
            !this.v$.signupData.email.required.$response && errors.push("Email is required");
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.v$.signupData.password.$dirty) return errors;
            !this.v$.signupData.password.minLength.$response && errors.push("Password must be 8 characters or more");
            !this.v$.signupData.password.required.$response && errors.push("Password is required");
            return errors;
        },
        repeatPasswordErrors() {
            const errors = [];
            if (!this.v$.signupData.repeatPassword.$dirty) return errors;
            !this.v$.signupData.repeatPassword.sameAsPassword.$response && errors.push("Passwords must match");
            !this.v$.signupData.repeatPassword.required.$response && errors.push("Repeat password is required");
            return errors;
        }
    }
}
</script>