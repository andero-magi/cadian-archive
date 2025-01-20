


<template>
    <div class="user_container">
        <div class="profile-page bg-darker  " >
    <h1 style="text-align: center; padding-bottom: 20px;">User Profile</h1>

    <div v-if="!user">
      <p>Loading user data...</p>
    </div>

    <div v-else>
      <div v-if="!isEditing" class="profile-info" >
        <p ><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="toggleEdit" class="btn btn-primary">Edit Profile</button>
        <button @click="showDeleteModal" class="btn btn-danger" >Delete Account</button>
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

      <div
        class="modal fade"
        id="deleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="deleteModalLabel">Confirm Account Deletion</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Enter your password to confirm account deletion:</p>
              <input
                v-model="deletePassword"
                type="password"
                class="form-control"
                placeholder="Enter your password"
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button @click="deleteAccount" type="button" class="btn btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
    
    <div class="container_posts">
        <h1 class="posts">Posts</h1>
        
    </div>
</template>

<style>
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}   
.user_container { 
    height: 100vh;
    border-right: 1px solid white;
    box-sizing: border-box;
}
.container_posts{
    height: 100vh;
    box-sizing: border-box;
    flex-grow: 1;
}
.posts{
    text-align: center;
    right: 100px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { API_URL } from "@/consts";

const user = ref(null);
const isEditing = ref(false);
const deletePassword = ref("");
const form = ref({
  username: "",
  email: "",
  password: "",
});

onMounted(async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("User not logged in. Redirecting to login.");
    window.location.href = "/login"; 
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data.");
    }

    user.value = await response.json();
    form.value.username = user.value.username;
    form.value.email = user.value.email;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    alert("Failed to load user profile. Please log in again.");
    window.location.href = "/login"; 
  }
});

function toggleEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
  form.value.username = user?.value?.username || "";
  form.value.email = user?.value?.email || "";
  form.value.password = "";
}

async function updateProfile() {
  try {
    const userId = user?.value?.id;
    if (!userId) {
      alert("User not logged in. Redirecting to login.");
      window.location.href = "/login"; 
      return;
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating profile:", errorData.error);
      alert("Failed to update profile. Please try again.");
      return;
    }

    const updatedUser = await response.json();
    console.log("Updated user data:", updatedUser);

    user.value = updatedUser;
    isEditing.value = false;
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    alert("Failed to update profile. Please try again.");
  }
}

function showDeleteModal() {
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  deleteModal.show();
}

async function deleteAccount() {
  try {
    if (!deletePassword.value) {
      alert("Please enter your password to delete the account.");
      return;
    }

    const userId = user?.value?.id;
    if (!userId) {
      alert("User not logged in. Redirecting to login.");
      window.location.href = "/login"; 
      return;
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: deletePassword.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || "Failed to delete account."}`);
      return;
    }

    alert("Account deleted successfully.");
    localStorage.clear();
    window.location.href = "/login";
  } catch (error) {
    console.error("Error deleting account:", error.message);
    alert("Failed to delete account. Please try again.");
  }
}
</script>