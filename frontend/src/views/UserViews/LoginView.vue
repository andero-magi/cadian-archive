<template>
  <div class="login-container">
    <div class="login-form bg-darker"> 
      <h1>Login</h1>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label for="username">Username:</label>
          <input v-model="username" id="username" type="text" placeholder="Enter your username" required />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input v-model="password" id="password" type="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" class="btn">Login</button>
        <p class="signup-link">Don't have an account? <a href="signup">Sign up</a></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { API_URL } from "@/consts"; 

const username = ref("");
const password = ref("");

async function submitForm() {
  try {
    const payload = {
      username: username.value,
      password: password.value,
    };

    //API call
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || "Login failed"}`);
      return;
    }

    const data = await response.json();
    alert(`Login successful! Welcome ${data.username || "User"}`);
    console.log("User data:", data);
    console.log("Login response data:", data);

    //localstorage update
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("username", data.username);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("authToken", data.token);
    //window.location.href = "/posts"

  } catch (error) {
    console.error("An error occurred during login:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-form {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: black;
}

input:focus {
  border-color: #00aaff;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #00aaff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0088cc;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
}

.signup-link a {
  color: #00aaff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
