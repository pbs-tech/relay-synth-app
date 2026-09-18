<template>
     <v-container align="center" justify="center">
        <v-snackbar top color="red" v-model="alert">
            Invalid email or password  
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
                    <v-toolbar-title class="text-h4 text-background" id="login-title"> Login </v-toolbar-title>
                    <v-spacer/>
                </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field 
                        class="text-body-1"
                        id="login-email-field"
                        label="Email" 
                        name="email"
                        prepend-icon="mdi-email" 
                        type="email"
                        v-model="loginData.email"
                        required/>
                    <v-text-field 
                        class="text-body-1"
                        id="login-password-field"
                        type="password" 
                        label="Password" 
                        name="password" 
                        prepend-icon="mdi-lock" 
                        v-model="loginData.password"
                        required/>
                </v-form>
                        <p id="signup-redirect-text" class="text-body-1 text-center"> Need an account? <router-link to="/signup"><span class="text-secondary" id="signup-redirect"> Signup </span></router-link></p>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-spacer/>
                <v-btn id="login-user" color="primary" @click="loginUser()">Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useUserStore } from "@/stores/useUserStore"
export default {
    
    name: "LoginCard",
    setup() {
        const userStore = useUserStore()
        return { 
            v$: useVuelidate(),
            userStore
        }
    },
    data() {
        return {
            showPassword: false,
            loginData: {
                email: "",
                password:""
            },
            alert: false
        };
    }, 
    validations() {
        return {
            loginData: {
                email: {
                    required,
                    email
                },
                password: {
                    required
                }
            }
        }
    },
    methods : {
        loginUser() {
            this.v$.$touch();
            if (this.v$.$invalid) {
                return;
            }
            let email = this.loginData.email;
            let password = this.loginData.password;
            this.userStore.login({ email, password })
            .then(() => {
                this.$router.push('/')
                this.$router.go();
            })
            .catch(err => this.alert = true);           
        }
    }
}
</script>