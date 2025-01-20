<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { reactive, onMounted } from "vue";

const user = reactive({
  loggedIn: false,
  id: ""
});

onMounted(() => {
  user.loggedIn = localStorage.getItem("isAuthenticated") === "true";
  user.id = localStorage.getItem("userId")
});

function logout() {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  
  user.loggedIn = false; 
  user.id = ""

  window.location.href = "/login";
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-darker border-bottom border-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Cadian Archives</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" aria-current="page" href="/">Home</a></li>
          
          <li v-if="user.loggedIn"><RouterLink class="nav-link" to="/newpost">New Post</RouterLink></li>

          <li><RouterLink class="nav-link" to="/about">About</RouterLink></li>
          <li><RouterLink class="nav-link" to="/searchUser">Search User</RouterLink></li>
        </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <template v-if="user.loggedIn">
            <li><a class="nav-link" :href="`/profile/${user.id}`">Profile</a></li>
            <li><a class="nav-link" href="#" @click="logout">Logout</a></li>
          </template>

          <template v-else>
            <li><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
