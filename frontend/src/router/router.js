import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import TotalSales from "../views/TotalSales.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import TrendingProducts from "../views/TrendingProducts.vue";
import Products from "../views/Products.vue";

// Defining routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/trending-products",
    name: "TrendingProducts",
    component: TrendingProducts,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/products",
    name: "products",
    component: Products,
  },
  {
    path: "/total-sales",
    name: "TotalSales",
    component: TotalSales,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

//  navigation guard to protect routes
router.beforeEach((to, from, next) => {
  // Check if the user is trying to access a protected route
  const authToken = localStorage.getItem("authToken");

  //  publicly accessible routes
  const publicPages = ["/login", "/signup"];
  const isPublicPage = publicPages.includes(to.path);

  if (!authToken && !isPublicPage) {
    // If the user is not logged in and trying to access a protected route, redirect to login
    return next("/login");
  }

  // If there's a token or it's a public page, allow the navigation
  next();
});

export default router;
