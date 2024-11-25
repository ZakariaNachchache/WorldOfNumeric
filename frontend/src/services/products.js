import axios from "axios";

export async function getProducts(token) {
  const url = "http://localhost:5000/products"; // The proxy route

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
