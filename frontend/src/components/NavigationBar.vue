<template>
  <vue-navigation-bar :options="navbarOptions">
    <!-- Conditionally render logout button inside navbar when logged in -->
    <!-- <template v-slot:right>
      <button @click="logout" class="logout-btn">Logout</button>
    </template> -->
  </vue-navigation-bar>
</template>

<script>
import { watch } from "vue"; // Import watch from Vue
import "vue-navigation-bar/dist/vue-navigation-bar.css";
import VueNavigationBar from "vue-navigation-bar";
import { useStore } from "../stores/store"; // Adjust path to your store

export default {
  name: "Navbar",
  components: {
    VueNavigationBar,
  },
  setup() {
    const store = useStore(); // Access the Pinia store

    const navbarOptions = {
      elementId: "main-navbar",
      isUsingVueRouter: true,
      mobileBreakpoint: 992,
      brandImagePath: "./",

      brandImageAltText: "brand-image",
      collapseButtonOpenColor: "#661c23",
      collapseButtonCloseColor: "#661c23",
      showBrandImageInMobilePopup: true,
      ariaLabelMainNav: "Main Navigation",
      tooltipAnimationType: "shift-away",
      menuOptionsLeft: [
        { type: "link", text: "Home", path: "/" },
        { type: "link", text: "Total Sales", path: "/total-sales" },
        {
          type: "link",
          text: "Trending Products",
          path: "/trending-products",
        },
        { type: "link", text: "Product List", path: "/products" },
      ],
      menuOptionsRight: [],
    };

    // Update navbar when token changes
    const updateNavbar = () => {
      if (store.token) {
        navbarOptions.menuOptionsRight = []; // Hide login/signup buttons
      } else {
        navbarOptions.menuOptionsRight = [
          {
            type: "button",
            text: "Signup",
            path: "./signup",
            class: "button-red",
          },
          { type: "button", text: "Login", path: "./login" },
        ]; // Show login/signup buttons
      }
    };

    // Watch for changes in token and update navbar
    watch(() => store.token, updateNavbar, { immediate: true });

    return { navbarOptions, store };
  },
};
</script>

<style scoped></style>
