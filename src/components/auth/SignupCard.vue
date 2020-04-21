<template>
    <v-container align="center" justify="center">
        <v-snackbar top color="red" v-model="alert">
            Could not create an account  
                <v-btn
                    color="background"
                    text
                    @click="alert = false"
                >
                    Close
                </v-btn>
        </v-snackbar>
        <v-card width="400" class="mx-auto ma-9">
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title class="title background--text" id="signup-title"> Signup </v-toolbar-title>
                    <v-spacer/>
                </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field 
                        class="body-1"
                        id="signup-email-field"
                        label="Email"
                        :error-messages="emailErrors"
                        name="email" 
                        prepend-icon="mdi-email" 
                        type="email"
                        v-model="signupData.email"
                        required
                        @input="$v.email.$touch()"
                        @blur="$v.email.$touch()"/>
                    <v-text-field 
                        class="body-1"
                        id="signup-password-field"
                        label="Password" 
                        :error-messages="passwordErrors"
                        type="password" 
                        name="password" 
                        prepend-icon="mdi-lock"
                        v-model="signupData.password" 
                        required
                        @input="$v.password.$touch()"
                        @blur="$v.password.$touch()"/>
                    <v-text-field 
                        class="body-1"
                        id="signup-repeat-password-field"
                        type="password" 
                        :error-messages="repeatPasswordErrors"
                        label="Repeat Password" 
                        name="repeat password" 
                        prepend-icon="mdi-repeat"
                        v-model="signupData.repeatPassword"
                        required
                        @input="$v.password.$touch()"
                        @blur="$v.password.$touch()" />
                </v-form>
                        <p id="login-redirect-text" class="body-1 text-center"> Already have an account? 
                            <router-link to="/login"> 
                                <span class="secondary--text" id="login-redirect">
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
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, email } from "vuelidate/lib/validators";
import { mapActions } from "vuex"

export default {
    name: "SignupCard",

    mixins: [validationMixin],

    data() {
        return {
            signupData: {
                email: "",
                password:"",
                repeatPassword:""
                
            },
            alert: false
        };
    }, methods : {
        ...mapActions(['signup']),
        signupUser() {
            this.$v.$touch();
            let data = {
                email: this.signupData.email,
                password: this.signupData.password
            };
            this.signup(data)
            .then(() => {
                this.$router.push('/')
                this.$router.go();
            })
            .catch(err => this.alert= true)
        }
    }, validations: {
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
               sameAsPassword: sameAs("password")
            }
        }
    }, computed: {
        emailErrors() {
            const errors = [];
            if (!this.$v.signupData.email.$dirty) return errors;
            !this.$v.signupData.email.email && errors.push("Must be a valid email");
            !this.$v.signupData.email.required && errors.push("Email is required");
            return errors;
        },
        passwordErrors() {
            const errors =[];
            if (!this.$v.signupData.password.$dirty) return errors;
            !this.$v.signupData.password.minLength && errors.push("Password must be 8 characters or more");
            !this.$v.signupData.password.required && errors.push("Password is required");
            return errors;
        },
        repeatPasswordErrors() {
            const errors =[];
            if (!this.$v.signupData.repeatPassword.$dirty) return errors;
            !this.$v.signupData.repeatPassword.sameAsPassword && errors.push("Passwords must match");
            return errors;
        }
    }
}
</script>