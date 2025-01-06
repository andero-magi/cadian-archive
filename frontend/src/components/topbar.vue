<script setup lang="ts">
import { RouterLink } from 'vue-router';

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
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/">Home</a>
          </li>
          <li>
            <RouterLink class="nav-link" to="/newpost">New Post</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
