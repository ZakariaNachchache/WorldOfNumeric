<template>
  <div class="trending-products-container">
    <h1 class="page-title">Trending Products</h1>

    <!-- Show a spinner while data is being fetched -->
    <div v-if="isLoading" class="spinner-container">
      <b-spinner
        variant="primary"
        style="width: 3rem; height: 3rem"
        label="Loading..."
      ></b-spinner>
    </div>

    <!-- Show error message if there's an issue with fetching data -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Show table with products data if available -->
    <div v-if="!isLoading && !errorMessage && trendingProducts.length > 0">
      <table class="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Quantity</th>
            <th>Total Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in trendingProducts" :key="product._id">
            <td>{{ product.productName }}</td>
            <td>{{ product.totalQuantity }}</td>
            <td>{{ product.totalAmount.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show a message if no trending products are found -->
    <div v-if="!isLoading && !errorMessage && trendingProducts.length === 0">
      <p>No trending products found.</p>
    </div>
  </div>
</template>

<script>
import { getTrendingProducts } from "../services/sales";

export default {
  name: "TrendingProducts",
  data() {
    return {
      trendingProducts: [],
      isLoading: true,
      errorMessage: "",
    };
  },
  async created() {
    const cachedTrendingProducts = localStorage.getItem(
      "cachedTrendingProducts"
    );

    if (cachedTrendingProducts) {
      this.trendingProducts = JSON.parse(cachedTrendingProducts);
      this.isLoading = false;
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          this.trendingProducts = await getTrendingProducts(token);
          localStorage.setItem(
            "cachedTrendingProducts",
            JSON.stringify(this.trendingProducts)
          );
          this.isLoading = false;
        } catch (error) {
          this.errorMessage = "Failed to load trending products.";
          this.isLoading = false;
        }
      } else {
        this.errorMessage = "User not authenticated.";
        this.isLoading = false;
      }
    }
  },
};
</script>

<style scoped>
.trending-products-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  color: #333;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.error-message {
  text-align: center;
  font-size: 16px;
  color: #d9534f;
  margin-top: 20px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.products-table th,
.products-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.products-table th {
  background-color: #f8f8f8;
  color: #555;
}

.products-table td {
  background-color: #f9f9f9;
}

.products-table tr:hover {
  background-color: #f1f1f1;
}

.products-table td:last-child {
  font-weight: bold;
  color: #28a745;
}
</style>
