<!-- src/views/About.vue -->
<template>
  <div>
    <h1>About Us</h1>
    <p>Information about the company.</p>
  </div>
</template>

<script>
import { clearLocalStorage } from "../services/auth";

export default {
  name: "About",
  mounted() {
    clearLocalStorage();
  },
};
</script>
