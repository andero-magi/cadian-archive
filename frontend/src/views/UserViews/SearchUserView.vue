<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/consts";


// Reactive state
const searchQuery = ref("");
const results = ref([]);
const searchPerformed = ref(false);

const router = useRouter();

async function onSearch() {
  searchPerformed.value = true;
  console.log(`Fetching: ${API_URL}/users?username=${encodeURIComponent(searchQuery.value.trim())}`);


  if (!searchQuery.value.trim()) {
    alert("Please enter a username to search.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users?username=${encodeURIComponent(searchQuery.value.trim())}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results.");
    }

    const data = await response.json();
    results.value = data;
  } catch (error) {
    console.error("Error during search:", error.message);
    alert("An error occurred while searching. Please try again.");
  }
}

//navigate to users profile page by their ID
function viewProfile(userId) {
  router.push(`/profile/${userId}`);
}
</script>


<template>
    <div class="d-block w-100 my-5">
      <div
        class="d-flex items-center justify-content-center flex-column p-4 bg-darker mx-auto"
        style="width: 50%; height: 80vh;"
      >
        <div class="d-block w-100">
          <h1 class="text-center my-5">Search Users</h1>
  
          <div style="max-width: 50%;" class="mx-auto">
            <form class="input-group mb-3" @submit.prevent="">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search by username ..."
                aria-label="Search"
                aria-describedby="search-button"
              />
              <button
                @click="onSearch"
                class="btn btn-primary"
                type="submit"
                id="search-button"
              >
                Search
              </button>
            </form>
          </div>
  
          <div class="mt-4" v-if="results.length > 0">
            <h3 class="text-center mb-3">Results</h3>
            <ul class="list-group">
              <li
                v-for="user in results"
                :key="user.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{{ user.username }}</strong> - {{ user.email }}
                </span>
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="viewProfile(user.id)"
                >
                  View Profile
                </button>
              </li>
            </ul>
          </div>
  
          <div class="mt-4 text-center" v-else-if="searchPerformed && results.length === 0">
            <p class="text-muted">No users found matching "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  