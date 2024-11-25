<template>
  <div class="sales-container">
    <h1>Total Sales</h1>

    <!-- Dropdown for Time Period Selection -->
    <div class="time-period-filter">
      <label for="timePeriod" class="filter-label">Select Time Period:</label>
      <select
        id="timePeriod"
        v-model="timePeriod"
        @change="updateDateRange"
        class="filter-select"
      >
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="365">Last 12 Months</option>
      </select>
    </div>

    <div v-if="totalSales !== null && !loading" class="sales-display">
      <h2>Total Sales: {{ totalSales.toFixed(2) }} USD</h2>
    </div>

    <!-- Manual Date Range Input -->
    <div class="date-range-input">
      <label for="startDate" class="date-label">Start Date:</label>
      <input
        type="date"
        id="startDate"
        v-model="startDate"
        class="date-input"
      />

      <label for="endDate" class="date-label">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" class="date-input" />

      <button @click="fetchTotalSales" class="fetch-button">Fetch Sales</button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <Spinner></Spinner>
    </div>

    <!-- Total Sales Data -->
  </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import { getTotalSales } from "../services/sales"; // Adjust the path as necessary

export default {
  name: "TotalSales",
  components: "Spinner",
  data() {
    return {
      timePeriod: "30", // Default time period is "Last 7 Days"
      startDate: "", // Stores the user's start date input
      endDate: "", // Stores the user's end date input
      totalSales: null, // Stores the total sales data
      loading: false, // Loading state
      error: null, // Error state
    };
  },
  methods: {
    // Updates the startDate and endDate based on the selected time period
    updateDateRange() {
      const now = new Date();
      let startDate;

      if (this.timePeriod === "7") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (this.timePeriod === "30") {
        startDate = new Date(now.setDate(now.getDate() - 30));
      } else if (this.timePeriod === "365") {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      this.startDate = startDate.toISOString().split("T")[0];
      this.endDate = new Date().toISOString().split("T")[0];
    },

    // Fetches total sales data from the API
    async fetchTotalSales() {
      if (!this.startDate || !this.endDate) {
        this.error = "Please enter both start and end dates.";
        return;
      }

      this.error = null;
      this.loading = true;

      try {
        const token = localStorage.getItem("authToken"); // JWT token
        const response = await getTotalSales(
          token,
          this.startDate,
          this.endDate
        );
        this.totalSales = response.totalSales;
      } catch (err) {
        this.error = err.response?.data?.error || "An error occurred.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Initialize with the default time period
    this.updateDateRange();
    this.fetchTotalSales();
  },
};
</script>

<style scoped>
/* Container for the whole page */
.sales-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  color: #333;
}

/* Title of the page */
h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
}

/* Time Period Filter */
.time-period-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-label {
  font-size: 1rem;
  margin-right: 10px;
}

.filter-select {
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  width: 200px;
  box-sizing: border-box;
  cursor: pointer;
}

/* Date Range Inputs */
.date-range-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}

.date-label {
  font-size: 1rem;
}

.date-input {
  padding: 8px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  width: 180px;
  box-sizing: border-box;
}

.fetch-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.fetch-button:hover {
  background-color: #0056b3;
}

/* Error and Loading States */
.error-message,
.loading-state {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
}

.error-message {
  color: #d9534f;
}

.loading-state {
  color: #f0ad4e;
}

/* Sales Display */
.sales-display {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 30px;
  margin-bottom: 30px;
}

.sales-display h2 {
  font-weight: 600;
  color: #28a745;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sales-container {
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .filter-select,
  .date-input {
    width: 150px;
  }

  .fetch-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
