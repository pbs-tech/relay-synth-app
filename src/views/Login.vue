<template>
    <v-img height="800" id="login-image" src='../assets/img/home.jpg'>
        <LoginCard/>
    </v-img>
</template>
<script>

import LoginCard from "@/components/auth/LoginCard"
export default {
   name: "Login",
   components: {
       LoginCard
   }
}
</script>