<template>
  <div id="app">
    <!-- Pass the loggedIn state as a prop to Layout -->
    <Layout :logged-in="loggedIn" @update-logged-in="handleLoggedInUpdate" />
  </div>
</template>

<script>
import Layout from "./components/Layout.vue";
import { useStore } from "./stores/store";

export default {
  name: "App",
  components: {
    Layout,
  },
  data() {
    return {
      loggedIn: !!localStorage.getItem("authToken"), // Initialize from localStorage
    };
  },
  methods: {
    handleLoggedInUpdate(newStatus) {
      // Update the loggedIn state and localStorage
      this.loggedIn = newStatus;
      if (!newStatus) {
        localStorage.removeItem("authToken");
      } else {
        // Add logic to set token if needed
      }
    },
  },
  mounted() {
    const store = useStore(); // Call useStore here
    console.log(store.token, "Token from Pinia");

    // Listen for changes to localStorage
    window.addEventListener("storage", this.syncLoggedInState);
  },
  beforeDestroy() {
    // Clean up event listener
    window.removeEventListener("storage", this.syncLoggedInState);
  },
  // methods: {
  //   syncLoggedInState() {
  //     console.log("Storage event detected");
  //     this.loggedIn = !!localStorage.getItem("authToken");
  //   },
  // },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
