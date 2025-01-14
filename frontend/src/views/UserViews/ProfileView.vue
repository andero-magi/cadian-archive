<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile-info {
  margin-bottom: 20px;
}

.edit-profile-form {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
}
</style>




<template>
    <div class="profile-page">
      <h1>User Profile</h1>
  
      <div v-if="!isEditing" class="profile-info">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="toggleEdit" class="btn btn-primary">Edit Profile</button>
      </div>
  
      <form v-if="isEditing" @submit.prevent="updateProfile" class="edit-profile-form">
        <div class="mb-3">
          <label for="username">Username:</label>
          <input v-model="form.username" id="username" type="text" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="email">Email:</label>
          <input v-model="form.email" id="email" type="email" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="password">New Password:</label>
          <input v-model="form.password" id="password" type="password" class="form-control" />
        </div>
        <button type="submit" class="btn btn-success">Save Changes</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
      </form>
    </div>
  </template>
  
  <script setup>
import { API_URL } from "@/consts";
import { ref } from "vue";
  
 //mock, need to replace with api call
  const user = await (await fetch(`${API_URL}/users${user.value.id}`))

  result = fetch(`${API_URL}/users`);

  const isEditing = ref(false);
  
  // Form state
  const form = ref({
    username: user.value.username,
    email: user.value.email,
    password: "dave1",
  });
  
  function toggleEdit() {
    isEditing.value = true;
  }
  
  function cancelEdit() {
    isEditing.value = false;
    form.value.username = user.value.username;
    form.value.email = user.value.email;
    form.value.password = "";
  }
  
  // Update profile
  async function updateProfile() {
    try {
      const response = await fetch(`http://localhost:5173/users/${user.value.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile.");
      }
  
      const updatedUser = await response.json();
  
      user.value.username = updatedUser.username;
      user.value.email = updatedUser.email;

      isEditing.value = false;
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert(error.message);
    }
  }
  </script>