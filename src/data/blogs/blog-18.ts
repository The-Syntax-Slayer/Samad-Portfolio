import type { BlogPost } from "../blogs";

export const blog18: BlogPost = {
  id: "blog-18",
  title: "Getting Started with Node.js & Express: Building Your First Web Server",
  slug: "getting-started-node-express-web-server",
  date: "April 19, 2026",
  readTime: "14 min read",
  excerpt: "Build a production-grade Node.js and Express backend. Understand middleware, routing, status handling, request parsing, and security configurations.",
  category: "Backend",
  tags: ["Node.js", "Express", "Backend", "JavaScript", "API", "WebDevelopment"],
  metaDescription: "Step-by-step tutorial on building a Node.js and Express web server. Understand routing, custom middleware, JSON parsing, error handling, and security.",
  metaKeywords: "Node js Express tutorial, build web server Node, Express middleware routing, Node backend API, error handling Express, Node development server",
  content: `### Introduction
When you build a React frontend, your application runs entirely inside the user's browser. While this is great for building rich visual user interfaces, browser-side JavaScript has a critical limitation: it cannot interact directly with a database, access the computer's filesystem, or execute secure business logic. If your React app needs to authenticate users, save comments, or process payments, you must send requests to a server.

To build these servers, developers historically had to learn a backend-specific language like Java, PHP, or Python. But with **Node.js**, you can build high-performance backend systems using the exact same JavaScript language you use on the frontend. 

By combining Node.js with **Express**, a minimalist routing web framework, you can build a fast, secure API server in just a few lines of code. This guide takes you step-by-step through setting up Node.js, understanding the middleware pipeline, and coding a production-ready Express server.

---

### The Express Middleware & Routing Pipeline
Express processes incoming HTTP requests using a pipeline of **middleware** functions before they reach your route controllers. Each middleware can inspect, modify, or block the request, or send a response immediately.

\`\`\`
  Incoming HTTP Request
          │
          ▼
┌──────────────────┐
│ CORS Middleware  │ ──> (Handles cross-origin permissions)
└──────────────────┘
          │
          ▼
┌──────────────────┐
│ JSON Parser      │ ──> (Parses raw JSON strings into req.body)
└──────────────────┘
          │
          ▼
┌──────────────────┐
│ Custom Logger    │ ──> (Logs request details to terminal console)
└──────────────────┘
          │
          ▼
┌──────────────────┐
│ Router Handler   │ ──> (Executes business logic, queries database)
└──────────────────┘
          │
          ▼
  Outgoing HTTP Response (e.g. 200 OK + JSON data)
\`\`\`

---

### What is Node.js & Express?
* **Node.js** is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. Built on Google Chrome's V8 JavaScript engine, Node.js uses an event-driven, non-blocking I/O model. This single-threaded event loop design allows Node.js to handle thousands of concurrent connections with minimal memory overhead, making it ideal for data-intensive real-time applications.
* **Express** is a fast, unopinionated, minimalist web framework for Node.js. It provides a thin layer of fundamental web application features, such as routing, request parsing, and middleware management, without obscuring the core Node.js features.

---

### Step-by-Step Project Setup
Before writing code, create a workspace and install the required NPM dependencies:

\`\`\`bash
# 1. Create directory and navigate into it
mkdir node-express-server
cd node-express-server

# 2. Initialize a package.json file (accepting defaults)
npm init -y

# 3. Install Express framework and development helper packages
npm install express dotenv cors
npm install --save-dev nodemon
\`\`\`

Add a dev start script to your \`package.json\` so the server restarts automatically when you save changes:
\`\`\`json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
\`\`\`

---

### Express Routing & Middleware Architecture
Express makes routing and request manipulation straightforward.

#### 1. Routing Parameters
Express routes define endpoints using HTTP method decorators. You can capture variables from the URL path:
* **Path Parameters (\`req.params\`)**: Used for identifying specific resources.
  * Route: \`/api/users/:userId\`
  * URL: \`/api/users/123\` -> \`req.params.userId\` is \`"123"\`
* **Query Parameters (\`req.query\`)**: Used for filtering or sorting.
  * Route: \`/api/users\`
  * URL: \`/api/users?role=admin\` -> \`req.query.role\` is \`"admin"\`

#### 2. Understanding Middleware
A middleware is a function that has access to the Request object (\`req\`), the Response object (\`res\`), and the next middleware function in the application's request-response cycle (\`next\`).
\`\`\`javascript
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Call next() to pass execution to the next middleware
});
\`\`\`
If a middleware does not call \`next()\`, the request is left hanging, and the browser eventually times out.

---

### Production-Grade Server Implementation
Here is a complete, production-grade Express server implementation. It features route handling, custom logging, built-in JSON parsing, CORS configuration, environment variables, and central error-handling middleware.

\`\`\`javascript
/**
 * @fileoverview Production-Grade Express Server
 * Demonstrates routing, middleware, CORS, and robust error handling.
 */

// Import core modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === GLOBAL MIDDLEWARES ===

// 1. Cross-Origin Resource Sharing configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://samadshaikh.dev',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body parsing middleware (essential for reading JSON payloads)
app.use(express.json());

// 3. Custom Request Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.path}\`);
  next();
});

// === DATABASE MOCK ===
const projects = [
  { id: 1, title: 'Samad Portfolio', tech: ['React', 'CSS Grid'] },
  { id: 2, title: 'Resume Portal', tech: ['TypeScript', 'Express'] }
];

// === ROUTING ENDPOINTS ===

// GET Endpoint: Fetch all resources
app.get('/api/v1/projects', (req, res) => {
  // Return successful JSON response
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects }
  });
});

// POST Endpoint: Create a new resource
app.post('/api/v1/projects', (req, res, next) => {
  const { title, tech } = req.body;

  // Simple input validation
  if (!title || !tech || !Array.isArray(tech)) {
    const err = new Error('Validation Error: title and tech array are required.');
    err.status = 400;
    return next(err); // Pass error to global handler
  }

  const newProject = {
    id: projects.length + 1,
    title,
    tech
  };

  projects.push(newProject);

  res.status(201).json({
    status: 'success',
    data: { project: newProject }
  });
});

// GET Endpoint: Fetch a single resource by ID
app.get('/api/v1/projects/:id', (req, res, next) => {
  const projectId = parseInt(req.params.id, 10);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    const err = new Error(\`Project with ID \${projectId} not found.\`);
    err.status = 404;
    return next(err);
  }

  res.status(200).json({
    status: 'success',
    data: { project }
  });
});

// === ERROR HANDLING MIDDLEWARE ===
// Must be defined last, containing 4 arguments (err, req, res, next)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// === SERVER LIFECYCLE ===
const server = app.listen(PORT, () => {
  console.log(\`Server is running in \${process.env.NODE_ENV || 'production'} mode on port \${PORT}\`);
});

// Graceful Shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
\`\`\`

---

### Security, Performance, and Deployment Hardening
1. **Never Run with Root Privileges**: Run your Node.js processes under a non-root user within your Linux container to limit security risks if your server is compromised.
2. **Environment Isolation**: Protect credentials. Use a package like \`dotenv\` and store private keys, API secrets, and database passwords in a \`.env\` file. Add this file to your \`.gitignore\` to prevent exposing credentials on GitHub.
3. **Helmet.js Configuration**: Before deploying to production, install and configure \`helmet\`. This middleware automatically sets HTTP headers to secure your application against cross-site scripting (XSS), clickjacking, and mime-type sniffing attacks.
4. **Use Response Compression**: Install the \`compression\` middleware in Express. It compresses your JSON payloads and assets using Gzip before sending them, reducing bandwidth usage and accelerating load times.

---

### Cross-Reading Recommendations
To design the API endpoints you will build with Express, read **[Understanding REST APIs: A Beginner's Guide to HTTP, JSON, and Endpoints](/?blog=understanding-rest-apis-http-json-endpoints)**. To version track your server configurations, check out **[Git and GitHub Simplified: Version Control & Collaboration for Beginners](/?blog=git-github-simplified-version-control-collaboration)**.

---

### Official Documentation References
* Node.js Foundation: **[Node.js Runtime Documentation](https://nodejs.org/en/docs/)**
* Express.js: **[Express Guide & Routing API Reference](https://expressjs.com/)**
* Helmet.js: **[Helmet Security Headers Documentation](https://helmetjs.github./)**

---

### Feedback & Collaboration
What tools do you use to test your local API server—nodemon, ts-node, or native Node.js watch mode? Have you built custom logging middlewares for your production APIs? Let's share backend patterns! Write your thoughts on my **[Resume Portal](https://samadshaikh.me)** or send a message via the Connect page on my **[Portfolio Portal](https://samadshaikh.dev)**.`
};
