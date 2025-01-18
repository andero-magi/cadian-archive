<template>
  <div class="profile-page" v-if="user">
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

  <div v-else class="loading">
    <p>Loading user data...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_URL } from "@/consts"; 

const user = ref(null); 
const isEditing = ref(false);

const form = ref({
  username: "",
  email: "",
  password: "",
});

const fetchUser = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not found, please log in again.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || "Unable to fetch user data"}`);
      return;
    }

    user.value = await response.json();
    // Populate fields
    form.value.username = user.value.username;
    form.value.email = user.value.email;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    alert("An unexpected error occurred. Please try again later.");
  }
};

onMounted(() => {
  fetchUser();
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

async function updateProfile() {
  try {
    const updatedUser = {
      ...user.value,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };

    const response = await fetch(`${API_URL}/users/${user.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || "Unable to update user data"}`);
      return;
    }

    //Update the user
    user.value = updatedUser;
    isEditing.value = false;
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    alert("An error occurred while updating the profile.");
  }
}
</script>

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

.btn {
  padding: 8px 16px;
  margin: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.loading {
  text-align: center;
}
</style>
