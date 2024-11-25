<template>
  <div class="products-container">
    <h1 class="title">Products</h1>
    <p class="subtitle">View and manage products in your inventory.</p>

    <!-- Button to add a new product -->
    <button @click="showAddProductForm" class="add-product-btn">
      Add New Product
    </button>

    <!-- Show a loading message while data is being fetched -->

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
    <div v-if="!isLoading && !errorMessage && products.length > 0">
      <div v-if="isAddProductFormVisible" class="add-product-form">
        <h2>{{ isEditing ? "Edit Product" : "Add Product" }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label for="productName">Product Name:</label>
            <input
              type="text"
              v-model="productForm.name"
              id="productName"
              required
            />
          </div>
          <div class="form-group">
            <label for="productPrice">Price:</label>
            <input
              type="number"
              v-model="productForm.price"
              id="productPrice"
              required
            />
          </div>
          <button type="submit" class="save-btn">
            {{ isEditing ? "Save Changes" : "Add Product" }}
          </button>
          <button @click="cancelForm" type="button" class="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
      <table class="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product.productName }}</td>
            <td>{{ product.productPrice.toFixed(2) }}</td>
            <td>
              <button @click="editProduct(product._id)" class="edit-btn">
                Edit
              </button>
              <button @click="deleteProduct(product._id)" class="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show a message if no products are found -->
    <div v-if="!isLoading && !errorMessage && products.length === 0">
      <p>No products available.</p>
    </div>

    <!-- Add/Edit Product Form (Hidden by default) -->
  </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import { getProducts } from "../services/products"; // Assuming this service is available

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      products: [], // Array to store the products
      isAddProductFormVisible: false, // Controls visibility of add/edit form
      isEditing: false, // Determines if we are editing an existing product
      productForm: {
        _id: null,
        name: "",
        price: null,
      },
      isLoading: false, // State for showing loading message
      errorMessage: "", // Error message if fetching fails
    };
  },
  methods: {
    // Fetch all products from the server using the getProducts service method
    async fetchProducts() {
      const token = localStorage.getItem("authToken"); // Get the auth token from localStorage
      this.isLoading = true; // Start loading
      this.errorMessage = ""; // Reset any previous error message
      try {
        const response = await getProducts(token); // Assuming this returns a promise
        this.products = response.map((product) => ({
          _id: product._id,
          productName: product.productName,
          productPrice: product.productPrice,
        }));
        this.products.length > 0
          ? console.log("Products fetched successfully")
          : console.log("No products found");
      } catch (error) {
        console.error("Error fetching products:", error);
        this.errorMessage = "An error occurred while fetching products."; // Set error message
      } finally {
        this.isLoading = false; // End loading, regardless of success or failure
      }
    },
    // Show the Add Product Form
    showAddProductForm() {
      this.isAddProductFormVisible = true;
      this.isEditing = false;
      this.resetForm();
    },
    // Edit an existing product
    editProduct(productId) {
      this.isAddProductFormVisible = true;
      this.isEditing = true;
      const product = this.products.find((p) => p._id === productId);
      this.productForm = { ...product }; // Copy the product data into the form
    },
    // Save product (either add or edit)
    saveProduct() {
      if (this.isEditing) {
        const index = this.products.findIndex(
          (p) => p._id === this.productForm._id
        );
        if (index !== -1) {
          this.products[index] = { ...this.productForm }; // Update product
        }
      } else {
        const newProduct = { ...this.productForm, _id: Date.now().toString() }; // Assign new ID
        this.products.push(newProduct); // Add new product to the list
      }
      this.cancelForm(); // Hide the form after saving
    },
    // Delete a product
    deleteProduct(productId) {
      this.products = this.products.filter((p) => p._id !== productId);
    },
    // Reset the form data
    resetForm() {
      this.productForm = {
        _id: null,
        name: "",
        price: null,
      };
    },
    // Cancel the form (close without saving)
    cancelForm() {
      this.isAddProductFormVisible = false;
    },
  },
  mounted() {
    this.fetchProducts(); // Fetch the products when the component is mounted
  },
};
</script>

<style scoped>
/* Basic styling for the container */
.products-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #777;
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 16px;
  color: #d9534f; /* Red color for error or loading state */
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

.add-product-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-product-btn:hover {
  background-color: #45a049;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  margin-right: 10px;
}

.edit-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

/* Form styling */
.add-product-form {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  margin-right: 10px;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}
</style>
