// services/sales.js
import axios from "axios";

export async function getCategorySales(token) {
  const url = "http://localhost:5000/query";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category sales:", error);
    throw error;
  }
}

export async function getTrendingProducts(token) {
  const url = "http://localhost:5000/trending-products";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
}
export async function getTotalSales(token, startDate, endDate) {
  const url = "http://localhost:5000/total_sales"; // Proxy route

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { startDate, endDate },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Error fetching total sales:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Error fetching total sales:", error.message);
    }
    throw error;
  }
}
