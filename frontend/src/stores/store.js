import { defineStore } from "pinia";

export const useStore = defineStore("token", {
  state: () => ({
    token: localStorage.getItem("authToken") || null, // Initialize from localStorage if token is stored
  }),

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("authToken", token); // Persist token to localStorage
    },
    logout() {
      console.log("store logout");
      this.token = null;
      localStorage.clear();
      // Clear token from localStorage and all other saved data
    },
  },
});
