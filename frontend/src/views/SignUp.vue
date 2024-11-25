<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          aria-label="Email"
          required
        />
      </div>
      <div class="input-group">
        <label for="username">User Name</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          aria-label="Username"
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
          aria-label="Password"
          required
        />
      </div>
      <div class="input-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirm your password"
          aria-label="Confirm Password"
          required
        />
      </div>
      <button type="submit" class="btn-signup">Sign Up</button>
    </form>

    <!-- Error Message Section -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Already have an account? Link -->
    <div class="already-have-account">
      <p>
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { signupUser } from "../services/auth"; // Assuming signupUser is in services/auth.js

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "", // To display any signup errors
    };
  },
  methods: {
    async handleSignup() {
      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      try {
        // Call the signup service
        const response = await signupUser(
          this.email,
          this.username,
          this.password
        );

        if (response.success) {
          // Store token and redirect on success
          if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
          }
          this.$router.push("/"); // Redirect to home or dashboard
        } else {
          // Display error from backend or fallback
          this.errorMessage =
            response.error || "Signup failed. Please try again.";
        }
      } catch (error) {
        // Display generic error message
        this.errorMessage = error.message || "An error occurred during signup.";
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
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

.already-have-account {
  text-align: center;
  margin-top: 20px;
}

.already-have-account p {
  font-size: 14px;
}

.already-have-account a {
  color: #1e6b22;
  font-weight: bold;
}
</style>
