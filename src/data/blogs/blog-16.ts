import type { BlogPost } from "../blogs";

export const blog16: BlogPost = {
  id: "blog-16",
  title: "Understanding REST APIs: A Beginner's Guide to HTTP, JSON, and Endpoints",
  slug: "understanding-rest-apis-http-json-endpoints",
  date: "April 05, 2026",
  readTime: "13 min read",
  excerpt: "Learn the core concepts of REST APIs. Understand HTTP methods, status codes, JSON payloads, and how to structure clean endpoints.",
  category: "Backend",
  tags: ["REST", "API", "HTTP", "JSON", "Backend", "WebDevelopment"],
  metaDescription: "An introductory guide to REST API concepts. Learn about HTTP verbs, status codes, JSON data structures, statelessness, and endpoint design.",
  metaKeywords: "REST API tutorial, HTTP methods, RESTful endpoints, JSON format, API status codes, backend development, API routing",
  content: `### Introduction
Imagine you are booking a flight online. You enter your destination, select your dates, and click search. In seconds, a list of flights appears. How did that website retrieve live flight schedules, pricing, and seating availability from multiple airlines' internal databases? It did not download their database systems onto your laptop. Instead, it communicated with the airlines' servers using an **API (Application Programming Interface)**.

Today, the standard design pattern for building web APIs is **REST (Representational State Transfer)**. REST APIs allow different computer programs (like a React frontend and a Node.js backend) to send and receive structured data over the internet using standard protocols. This guide provides a detailed look at how REST APIs work, how they use HTTP, and how to design clean, production-ready endpoints.

---

### Client-Server Communication Flow
In a RESTful architecture, communication always begins with a **Client** (e.g., your browser or mobile app) sending an **HTTP Request** to a **Server** hosting the database. The server processes the request and sends back an **HTTP Response**.

\`\`\`
┌──────────┐                                                   ┌──────────┐
│          │ ─────── HTTP REQUEST (GET /api/v1/projects) ─────> │          │
│  CLIENT  │                                                   │  SERVER  │
│ (Browser)│ <────── HTTP RESPONSE (200 OK + JSON Data) ─────── │ (Backend)│
└──────────┘                                                   └──────────┘
\`\`\`

---

### What is REST?
REST is not a programming language, framework, or database. It is an **architectural style** defined by a set of constraints. If an API adheres to these constraints, it is called **RESTful**.

#### Key Constraints of REST
1. **Client-Server Separation**: The client (UI) and the server (database and business logic) must be independent. You can replace the entire frontend interface without changing how the database handles data.
2. **Statelessness**: Each HTTP request from the client to the server must contain all the information necessary to understand and process the request. The server does not store session state about the client. This makes REST APIs scalable, as any server in a cluster can handle any request.
3. **Cacheability**: Server responses must define themselves as cacheable or non-cacheable to prevent clients from fetching static, unchanged data repeatedly.
4. **Uniform Interface**: All API components must communicate using a consistent standard. This means using uniform URI endpoints, standard HTTP verbs, and a standard serialization format (like JSON).

---

### HTTP Methods: The Verbs of the Web
REST uses standard HTTP methods to perform operations on resources (data objects). These operations correspond directly to CRUD database actions.

* **GET**: Retrieve data from the server. GET requests must only retrieve data and should not modify state on the server.
* **POST**: Create a new resource. The client sends the new data inside the request body.
* **PUT**: Replace an existing resource entirely. The client sends the entire updated resource.
* **PATCH**: Update a resource partially. The client sends only the properties that need to change.
* **DELETE**: Remove a resource from the server.

#### Idempotency in REST
An operations is **idempotent** if performing it multiple times yields the same result on the server as performing it once.
* **GET**, **PUT**, and **DELETE** are idempotent. If you delete a resource with ID 10 once, it is gone. If you call DELETE on ID 10 again, it is still gone.
* **POST** is **not** idempotent. Calling POST five times will create five duplicate database entries.

---

### JSON: The Language of REST
REST APIs can theoretically transfer data in any format (including XML, YAML, or plain text), but **JSON (JavaScript Object Notation)** is the industry standard. JSON is lightweight, easy for humans to read, and natively supported by JavaScript, making parsing effortless.

#### JSON Data Types
JSON supports basic values (Strings, Numbers, Booleans, Null) and structural values (Objects, Arrays).
\`\`\`json
{
  "id": 101,
  "title": "Build Portfolio Site",
  "isCompleted": false,
  "technologies": ["React", "CSS Grid"],
  "owner": {
    "name": "Samad Shaikh",
    "email": "samad@samadshaikh.me"
  }
}
\`\`\`

---

### HTTP Status Codes: The Server's Response
Every response from a server contains a three-digit status code. These are grouped into classes that tell the client the outcome of the request:

* **2xx (Success)**
  * \`200 OK\`: Request completed successfully.
  * \`201 Created\`: Resource successfully created (usually returned after a POST request).
* **3xx (Redirection)**
  * \`301 Moved Permanently\`: The resource now resides at a different URI.
* **4xx (Client Error)**
  * \`400 Bad Request\`: Invalid syntax or missing required fields in request payload.
  * \`401 Unauthorized\`: Authentication is required (missing or invalid API key/token).
  * \`403 Forbidden\`: Client is authenticated but lacks permission to access the resource.
  * \`404 Not Found\`: The requested resource does not exist.
* **5xx (Server Error)**
  * \`500 Internal Server Error\`: The server encountered an unexpected error.

---

### Designing Clean RESTful Endpoints
Clean API design is critical for integration. A RESTful URI should reference **nouns (resources)** in the plural form, not verbs (actions).

| Poor API Design (Verb-based) | RESTful API Design (Noun-based) |
| :--- | :--- |
| \`POST /createProject\` | \`POST /api/v1/projects\` |
| \`GET /getProject?id=5\` | \`GET /api/v1/projects/5\` |
| \`POST /updateProject?id=5\` | \`PUT /api/v1/projects/5\` |
| \`POST /deleteProject?id=5\` | \`DELETE /api/v1/projects/5\` |

#### Hierarchical Resource Nesting
If resources are dependent on other resources, reflect that in the URI path hierarchy:
* To get comments for a specific blog post: \`GET /api/v1/blogs/15/comments\`
* To delete a specific comment under that blog: \`DELETE /api/v1/blogs/15/comments/3\`

#### Filtering and Pagination
Never create unique paths for search queries. Use query parameters instead:
* Filtering: \`GET /api/v1/projects?status=completed\`
* Pagination: \`GET /api/v1/projects?page=2&limit=10\`

---

### Production-Grade Request & Response Log
Below is a complete, annotated request/response transaction detailing a user registration request.

#### HTTP Request Payload
\`\`\`http
POST /api/v1/users HTTP/1.1
Host: api.samadshaikh.dev
Content-Type: application/json
Authorization: Bearer mock-temp-token-xyz

{
  "username": "developer101",
  "email": "dev@samadshaikh.me",
  "profile": {
    "displayName": "Alex Dev",
    "skills": ["JavaScript", "React"]
  }
}
\`\`\`

#### HTTP Response Payload
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json
Cache-Control: no-store, no-cache
Date: Sun, 05 Apr 2026 12:00:00 GMT

{
  "status": "success",
  "message": "User account created successfully",
  "data": {
    "userId": "usr_998877",
    "username": "developer101",
    "createdAt": "2026-04-05T12:00:00.000Z",
    "links": {
      "self": "/api/v1/users/usr_998877",
      "profile": "/api/v1/users/usr_998877/profile"
    }
  }
}
\`\`\`

---

### Security & Performance Guidelines
1. **Enforce HTTPS (TLS)**: Never transmit API payloads over plain HTTP. HTTPS encrypts the request URL parameters, headers, and body, protecting sensitive user tokens or passwords from man-in-the-middle attacks.
2. **Implement Rate Limiting**: Limit the number of requests a client can make within a time window (e.g., 100 requests per minute) to protect your database from Denial of Service (DoS) attacks and crawler abuse.
3. **Cross-Origin Resource Sharing (CORS)**: Configure CORS headers on the server to restrict which external domains can fetch data from your API. By default, browsers prevent scripts from reading cross-origin responses unless the server explicitly returns \`Access-Control-Allow-Origin\`.
4. **Use JSON Web Tokens (JWT) for Auth**: Since REST is stateless, do not use session cookies. Instead, have the client send a cryptographically signed JWT inside the \`Authorization: Bearer <token>\` header for each request.

---

### Cross-Reading Recommendations
To build web services that run these REST API endpoints, read **[Getting Started with Node.js & Express: Building Your First Web Server](/?blog=getting-started-node-express-web-server)**. To manage deployment and code histories for these endpoints, check out **[Git and GitHub Simplified: Version Control & Collaboration for Beginners](/?blog=git-github-simplified-version-control-collaboration)**.

---

### Official Documentation References
* W3C HTTP Standards: **[RFC 7231 Hypertext Transfer Protocol Semantics](https://datatracker.ietf.org/doc/html/rfc7231)**
* MDN Web Docs: **[Overview of HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)**
* JSON Standard: **[ECMA-404 The JSON Data Interchange Standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)**

---

### Feedback & Collaboration
What tool do you use to test your API endpoints—Postman, Bruno, or curl commands? Have you encountered issues handling CORS policies when fetching data in React? Let's discuss backend design! Share your thoughts on my **[Resume Portal](https://samadshaikh.me)** or send a message via the Connect tab on my **[Portfolio Portal](https://samadshaikh.dev)**.`
};
