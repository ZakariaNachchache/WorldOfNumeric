import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// Enable CORS for all routes
app.use(cors());

// Use express.json() to parse JSON request bodies
app.use(express.json()); // This line is crucial to parse JSON

// Proxy the category_sales route
app.get("/query", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/analytics/category_sales",
      {
        headers: req.headers, // Forward the headers from the original request
      }
    );
    res.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).json({ error: "Error proxying the request" });
  }
});

// New route to proxy the login request
// New route to proxy the login request
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure the body to get email and password

  try {
    // Send a POST request to the login endpoint
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      {
        // Assuming email is used as the username in the backend
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      }
    );

    // Forward the successful response from the API back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Invalid Credentials", error);

    // If the error response contains a message, forward that to the frontend
    const errorMessage = error.response?.data?.message || "Invalid Credentials";

    // Check if the error code is 400 (Bad Request) and set the proper response
    if (error.response?.status === 400) {
      res.status(400).json({ error: errorMessage });
    } else {
      // If it's another error, send 500
      res.status(500).json({ error: "An error occurred during login" });
    }
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body; // Destructure the body to get email, password, and confirmPassword

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Send a POST request to the signup endpoint
    const response = await axios.post(
      "http://localhost:3000/auth/signup",
      { email, password, username }, // Forward email and password
      { headers: { "Content-Type": "application/json" } }
    );

    // Forward the successful response from the API back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error during signup:", error);

    // Extract error message from the backend response
    const errorMessage = error.response?.data?.message || "Signup failed";

    // Forward the error response with proper status
    if (error.response?.status === 400) {
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "An error occurred during signup" });
    }
  }
});

app.get("/trending-products", async (req, res) => {
  try {
    // Send a GET request to the trending_products endpoint on your backend
    const response = await axios.get(
      "http://localhost:3000/analytics/trending_products", // Update with the correct API endpoint
      {
        headers: req.headers, // Forward the headers from the original request
      }
    );
    res.json(response.data); // Send the response data back to the client
  } catch (error) {
    console.error("Error proxying request to trending products:", error);
    res.status(500).json({ error: "Error proxying the request" });
  }
});

app.get("/total_sales", async (req, res) => {
  try {
    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    console.log("Forwarding request to backend with:", { startDate, endDate });

    // Proxy the request to the backend endpoint
    const response = await axios.get(
      "http://localhost:3000/analytics/total_sales", // Backend API endpoint
      {
        params: { startDate, endDate }, // Pass query parameters
        headers: {
          Authorization: req.headers.authorization, // Pass token if provided
          "Content-Type": "application/json",
        },
      }
    );

    // Respond to the client with the backend's response
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // Log backend error details
      console.error(
        "Backend returned an error:",
        error.response.status,
        error.response.data
      );
      res.status(error.response.status).json(error.response.data);
    } else {
      // Log other errors (network, unexpected issues)
      console.error("Error proxying request to total_sales:", error.message);
      res.status(500).json({ error: "Error proxying the request" });
    }
  }
});

app.get("/products", async (req, res) => {
  try {
    // Proxy the request to the backend products endpoint
    const response = await axios.get(
      "http://localhost:3000/products", // Backend API endpoint
      {
        headers: req.headers, // Forward the headers from the original request
      }
    );
    res.json(response.data); // Send the response data back to the client
  } catch (error) {
    if (error.response?.status === 400) {
      res.status(400).json({ error: errorMessage });
    } else {
      console.error("Error proxying request to products:", error);
      res.status(500).json({ error: "Error proxying the request" });
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`CORS Proxy running on http://localhost:${PORT}`);
});
