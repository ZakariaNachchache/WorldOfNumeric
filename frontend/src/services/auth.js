import axios from "axios";
import { useStore } from "../stores/store";

// Method to log in using the CORS proxy
export async function loginUser(email, password) {
  const url = "http://localhost:5000/login"; // CORS Proxy route
  const store = useStore();
  try {
    // Send the login credentials to the proxy route
    const response = await axios.post(
      url,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      }
    );

    if (response.data.token) {
      // Store token in localStorage
      store.setToken(response.data.token);
      localStorage.setItem("authToken", response.data.token);
      console.log(store.token, "store token");
      return { success: true, token: response.data.token }; // Return success and token
    }

    // Return error message if no token is received
    return { success: false, error: "Authentication failed" };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Invalid credentials",
    };
  }
}

// Method to sign up using the CORS proxy
export async function signupUser(email, password, confirmPassword) {
  const url = "http://localhost:5000/signup"; // CORS Proxy route

  try {
    // Send the signup credentials to the proxy route
    const response = await axios.post(
      url,
      {
        email,
        password,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      }
    );

    if (response.data.success) {
      // Optionally, store token or user data if returned
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return { success: true, data: response.data }; // Return success and any returned data
    }

    // Return error message if success flag is not true
    return { success: false, error: "Signup failed" };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "An error occurred during signup",
    };
  }
}

// Method to log out by deleting authToken and redirecting the user

export function clearLocalStorage() {
  console.log("auth functioon");
  localStorage.clear();
}
