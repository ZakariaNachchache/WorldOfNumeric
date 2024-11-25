import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router"; // Import the router
// Import Bootstrap and BootstrapVue 3 CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
// Import the components
import SalesPieChart from "./components/PieChart.vue";
// Import BootstrapVue3
import BootstrapVue3 from "bootstrap-vue-3";
import { createPinia } from "pinia";

// Create the Vue app
const app = createApp(App);
// Register components globally
app.component("SalesPieChart", SalesPieChart);
// Use BootstrapVue 3 plugin
app.use(BootstrapVue3);
const pinia = createPinia();
app.use(pinia);
// Use the router
app.use(router);
// Mount the app
app.mount("#app");
