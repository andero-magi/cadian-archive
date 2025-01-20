<template>
  <div class="signup-container">
    <div class="signup-form">

    <h1>Create an Account</h1>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label for="username">Username:</label>
          <input
            v-model="username"
            id="username"
            type="text"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="input-group">
          <label for="email">Email:</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn">Sign Up</button>
        <p class="login-link">
          Already have an account? <RouterLink to="/login">Log in</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/consts";

const username = ref("");
const email = ref("");
const password = ref("");

const router = useRouter();

async function submitForm() {
  try {
    const payload = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || "Sign-up failed"}`);
      return;
    }

    const data = await response.json();
    alert(`Account created successfully! You can now log in.`);
    router.push("/login");
  } catch (error) {
    console.error("An error occurred during sign-up:", error);
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

.signup-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.signup-form {
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

.login-link {
  text-align: center;
  margin-top: 15px;
}

.login-link a {
  color: #00aaff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
