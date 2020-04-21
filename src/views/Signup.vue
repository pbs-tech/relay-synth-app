<template>
    <v-img height="800" id="login-image" src='../assets/img/home.jpg'>
        <SignupCard/>
    </v-img>
</template>
<script>

import SignupCard from "@/components/auth/SignupCard"

export default {
    name: "Signup",
    components: {
        SignupCard
    }
}
</script>