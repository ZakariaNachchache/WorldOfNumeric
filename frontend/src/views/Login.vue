<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit" class="btn-login">Login</button>
    </form>

    <!-- Error Message Section -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Create Account Link -->
    <div class="create-account">
      <p>
        Don't have an account?
        <router-link to="/signup">Create an account</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../services/auth"; // Assuming loginUser is in services/auth.js

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "", // To display any login errors
    };
  },
  created() {
    // Check if authToken exists in localStorage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Redirect to home if the token exists
      this.$router.push("/");
    }
  },
  methods: {
    async handleLogin() {
      try {
        // Attempt to log in using the loginUser function
        const response = await loginUser(this.email, this.password);

        // If login is successful, store the authToken and redirect
        if (response.success) {
          localStorage.setItem("authToken", response.token); // Save token in localStorage
          this.$router.push("/"); // Redirect to home
        } else {
          // Handle other cases of failure
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        // If loginUser throws an error, display it to the user
        this.errorMessage = error.message || "An error occurred during login.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1 {
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

input {
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #1e6b22;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

button:hover {
  background-color: #3d8b41;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
}

.create-account {
  text-align: center;
  margin-top: 20px;
}

.create-account p {
  font-size: 14px;
}

.create-account a {
  color: #1e6b22;
  font-weight: bold;
}
</style>
