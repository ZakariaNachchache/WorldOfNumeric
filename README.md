# Project Overview

Working on this project was an incredibly rewarding experience. It allowed me to apply my skills to a concrete project,
from building scalable backend services to creating an interactive frontend interface.
I hope you enjoy exploring and using this project as much as I enjoyed developing it.

## Installation 

To install and run the project, follow these steps:
 Clone the repository using git clone repo .
 then navigate to the project directory.
 Inside the `/backend` folder, create a .env file and add the variables provided on the email: MONGO_URI & JWT_SECRET.
 Next, install the dependencies for both the backend and frontend by running npm i in their respective directories.
 Once the dependencies are installed.
 ## Setup
 start the backend server using npm start in the /backend folder.
 Then, navigate to the /frontend folder and run npm run dev to start the frontend development server.
 To avoid CORS issues, run the proxy server by executing node corsProxy.js from the root of the /frontend directory.
 After completing these steps, the project will be ready to use. Enjoy!


## Future Improvements & Perspectives

   In Addition to creating aggregations and custom Indexes on the Database documents such as Date and Products fields on Sales for faster quering.
 The project provides a solid foundation for a sales management system, but several optimizations could enhance its performance and maintainability:
Performance Optimizations

Caching Implementation

Redis implementation for frequently accessed API responses
Caching of expensive aggregation results like sales statistics
Cache invalidation strategy for dynamic data
Temporary caching of trending products with appropriate TTL


MongoDB Optimizations

Creation of materialized views for frequent aggregation queries
Views implementation for standard sales reports
Composite indexes for optimizing common search queries
Sharding of large collections for better scalability


Additional Enhancements

Rate limiting system implementation
Result pagination for large collections
API response compression
CDN setup for static resources



These improvements would significantly optimize system performance, particularly for high loads and complex aggregation queries.
