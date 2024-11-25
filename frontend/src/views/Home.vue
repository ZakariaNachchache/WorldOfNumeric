<template>
  <div id="app">
    <!-- Use custom Spinner component -->
    <div v-if="isLoading" class="loading-container">
      <Spinner />
    </div>

    <div class="division" v-if="!isLoading && !errorMessage">
      <div id="pie-chart">
        <h1>Sales by Category</h1>
        <SalesPieChart :salesData="salesData" :categories="categories" />
      </div>

      <div class="total-sales">
        <h2>Total Sales</h2>
        <p>${{ totalSales.toFixed(2) }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button v-if="isTokenError" class="btn-relogin" @click="handleReLogin">
        Return to Login
      </button>
    </div>
  </div>
</template>

<script>
import SalesPieChart from "../components/PieChart.vue";
import Spinner from "../components/Spinner.vue";
import { getCategorySales, getTrendingProducts } from "../services/sales";
import { useStore } from "../stores/store";

export default {
  name: "App",
  components: {
    SalesPieChart,
    Spinner,
  },
  data() {
    return {
      salesData: [],
      categories: [],
      totalSales: 0,
      trendingProducts: [],
      isLoading: false,
      errorMessage: "",
      isDataFetched: false,
      isTokenError: false,
      tokenCheckInterval: null,
      maxTokenWaitTime: 5000, // 5 seconds maximum wait time
    };
  },
  computed: {
    token() {
      const store = useStore();
      return store.token;
    },
  },
  methods: {
    handleReLogin() {
      this.logout();
    },
    logout() {
      const store = useStore();
      this.clearLocalData();
      store.clearToken();
      this.$router.push("/login");
    },
    clearLocalData() {
      localStorage.removeItem("cachedSalesData");
      localStorage.removeItem("cachedTrendingProducts");
      this.salesData = [];
      this.categories = [];
      this.totalSales = 0;
      this.trendingProducts = [];
      this.isDataFetched = false;
    },
    async validateToken() {
      if (!this.token) {
        throw new Error("No authentication token found");
      }
      return true;
    },
    async waitForToken() {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        this.tokenCheckInterval = setInterval(() => {
          if (this.token) {
            clearInterval(this.tokenCheckInterval);
            resolve(true);
          } else if (Date.now() - startTime > this.maxTokenWaitTime) {
            clearInterval(this.tokenCheckInterval);
            reject(new Error("Token initialization timeout"));
          }
        }, 100);
      });
    },
    async fetchData() {
      try {
        this.isLoading = true;
        this.errorMessage = "";
        this.isTokenError = false;

        // Wait for token to be initialized
        await this.waitForToken();
        await this.validateToken();

        const cachedSalesData = localStorage.getItem("cachedSalesData");
        const cachedTrendingProducts = localStorage.getItem(
          "cachedTrendingProducts"
        );

        if (cachedSalesData && cachedTrendingProducts) {
          const salesData = JSON.parse(cachedSalesData);
          const trendingProducts = JSON.parse(cachedTrendingProducts);

          this.salesData = salesData.salesData;
          this.categories = salesData.categories;
          this.totalSales = salesData.totalSales;
          this.trendingProducts = trendingProducts;
        } else {
          const [salesResponse, trendingResponse] = await Promise.all([
            getCategorySales(this.token).catch((error) => {
              throw new Error(`Error fetching sales data: ${error.message}`);
            }),
            getTrendingProducts(this.token).catch((error) => {
              throw new Error(
                `Error fetching trending products: ${error.message}`
              );
            }),
          ]);

          this.categories = salesResponse.categorySales.map((t) => t.category);
          this.salesData = salesResponse.categorySales.map(
            (category) => category.totalSales
          );
          this.totalSales = this.salesData.reduce(
            (sum, sales) => sum + sales,
            0
          );
          this.trendingProducts = trendingResponse;

          localStorage.setItem(
            "cachedSalesData",
            JSON.stringify({
              salesData: this.salesData,
              categories: this.categories,
              totalSales: this.totalSales,
            })
          );
          localStorage.setItem(
            "cachedTrendingProducts",
            JSON.stringify(this.trendingProducts)
          );
        }

        this.isDataFetched = true;
      } catch (error) {
        console.error("Error in fetchData:", error);

        if (
          error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("authentication") ||
          error.message.includes("token") ||
          error.message.includes("timeout")
        ) {
          this.isTokenError = true;
          this.errorMessage = error.message.includes("timeout")
            ? "Failed to initialize authentication. Please try logging in again."
            : "Session expired. Please login again.";
          this.clearLocalData();
        } else {
          this.errorMessage = "Error loading data. Please try again.";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    if (!this.isDataFetched) {
      await this.fetchData();
    }
  },
  beforeUnmount() {
    // Clean up interval if component is unmounted
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

#pie-chart {
  margin-top: 20px;
  width: 50%;
  height: 50%;
  margin-left: 100px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.total-sales {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #333;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.total-sales h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #661c23;
}

.total-sales p {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.division {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 100px;
  padding: 20px;
}

.error-message {
  font-size: 1.5rem;
  color: #d9534f;
  margin-top: 30px;
  font-weight: bold;
  background-color: #f8d7da;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-relogin {
  margin-top: 15px;
  padding: 8px 16px;
  font-size: 1rem;
  color: white;
  background-color: #0056b3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-relogin:hover {
  background-color: #003d82;
}
</style>
