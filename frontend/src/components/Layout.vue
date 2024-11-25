<template>
  <div>
    <Navbar />
    <!-- Conditionally show the Logout button based on computed loggedIn -->
    <button v-if="loggedIn" @click="logout" class="logout-btn">Logout</button>
    <div class="layout-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "./NavigationBar.vue";
import { useStore } from "../stores/store"; // Import the Pinia store

export default {
  name: "Layout",
  components: {
    Navbar,
  },
  computed: {
    // Computed property to get the loggedIn status from the store's token state
    loggedIn() {
      const store = useStore();
      return store.token !== null; // If token exists, the user is logged in
    },
  },
  methods: {
    logout() {
      const store = useStore();
      store.logout(); // Calls the logout action from the Pinia store

      // After logout, redirect to the login page
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.layout-content {
  padding: 20px;
}

/* Styling for the logout button */
.logout-btn {
  background-color: #ff4c4c; /* Red background for attention */
  color: white;
  padding: 5px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 10px;
  /* Adjust the position */
}

.logout-btn:hover {
  background-color: #e60000; /* Darker red when hovered */
  transform: scale(1.05); /* Slightly enlarge the button on hover */
}

.logout-btn:active {
  background-color: #cc0000; /* Dark red when the button is pressed */
  transform: scale(1); /* Return to normal size on click */
}

.logout-btn:focus {
  outline: none; /* Remove the outline when the button is focused */
}
</style>
