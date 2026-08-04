# Project Tech Stack

## Overview
The Online Lost and Found System is built using the MERN stack (MongoDB, Express, React, Node.js). This stack was chosen for its flexibility, use of a single language (JavaScript/TypeScript) across the entire stack, and its robust ecosystem.

## Core Technologies

### 1. React (Frontend)
- **What it is**: A declarative, efficient, and flexible JavaScript library for building user interfaces.
- **Why it was chosen**: Component-based architecture allows for reusability. Virtual DOM ensures high performance.
- **Where it is used**: Entire frontend application, including UI components, routing (React Router), and state management.

#### Interview Questions:
- **Q: What is the Virtual DOM?** A: A lightweight in-memory representation of the actual DOM. React uses it to diff changes and efficiently update only the changed parts of the real DOM.
- **Q: What are React Hooks?** A: Functions that let you "hook into" React state and lifecycle features from function components (e.g., `useState`, `useEffect`).
- **Q: Explain component lifecycle in functional components.** A: Lifecycle methods are handled by the `useEffect` hook, which can act as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` depending on its dependency array.

### 2. Node.js (Runtime)
- **What it is**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Why it was chosen**: Allows executing JavaScript on the server, providing a unified language for the project. It uses an event-driven, non-blocking I/O model making it lightweight and efficient.
- **Where it is used**: Backend server environment.

#### Interview Questions:
- **Q: Is Node.js single-threaded?** A: Yes, it uses a single-threaded event loop architecture to handle multiple concurrent clients. However, it uses worker threads in the background for certain I/O tasks.
- **Q: What is the event loop?** A: The mechanism that allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.
- **Q: How does Node.js handle concurrency?** A: Through asynchronous, non-blocking I/O callbacks and the event loop.

### 3. Express.js (Backend Framework)
- **What it is**: A minimal and flexible Node.js web application framework.
- **Why it was chosen**: Simplifies API creation, routing, and middleware integration compared to raw Node.js `http` module.
- **Where it is used**: Backend API routing and middleware management.

#### Interview Questions:
- **Q: What is middleware in Express?** A: Functions that have access to the request object, response object, and the next middleware function in the application’s request-response cycle.
- **Q: How do you handle errors in Express?** A: By defining an error-handling middleware function that takes four arguments: `(err, req, res, next)`.
- **Q: Explain `app.use()`.** A: It is used to mount the specified middleware function or functions at the specified path.

### 4. MongoDB (Database)
- **What it is**: A source-available cross-platform document-oriented NoSQL database program.
- **Why it was chosen**: Flexible schema design is ideal for items with varying attributes. High scalability and integrates seamlessly with Node.js.
- **Where it is used**: Primary data store for Users, Items, Claims, and Categories.

#### Interview Questions:
- **Q: What is a Document in MongoDB?** A: A record in a MongoDB collection and the basic unit of data. Documents are analogous to JSON objects.
- **Q: What is the difference between SQL and NoSQL?** A: SQL databases are relational and table-based with strict schemas, while NoSQL databases are non-relational, document-based, key-value pairs, or graph databases with flexible schemas.
- **Q: How do you achieve relationships in MongoDB?** A: Using manual references (storing the `_id` of one document in another) or DBRefs.

### 5. Mongoose (ODM)
- **What it is**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Why it was chosen**: Provides a straight-forward, schema-based solution to model application data. Includes built-in type casting, validation, query building, and business logic hooks.
- **Where it is used**: To define data schemas and interact with MongoDB from the Express backend.

#### Interview Questions:
- **Q: What is the difference between Mongoose and MongoDB native driver?** A: Mongoose provides an abstraction layer over the native driver, allowing you to define schemas, models, and validation rules.
- **Q: What are Mongoose middlewares (hooks)?** A: Functions that are passed control during execution of asynchronous functions at the schema level (e.g., `pre` and `post` save).
- **Q: Explain populate() in Mongoose.** A: It is used to automatically replace the specified paths in the document with document(s) from other collections.

### 6. JSON Web Tokens (JWT) (Authentication)
- **What it is**: An open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
- **Why it was chosen**: Stateless authentication mechanism, reducing database lookups for session validation.
- **Where it is used**: Securing API endpoints and verifying user identity.

#### Interview Questions:
- **Q: What are the three parts of a JWT?** A: Header, Payload, and Signature.
- **Q: Is JWT encrypted?** A: No, it is Base64Url encoded and signed, not encrypted. The payload is readable by anyone who intercepts it.
- **Q: How do you invalidate a JWT before its expiration?** A: Since JWTs are stateless, you typically cannot invalidate them directly. Solutions include using short expiration times with refresh tokens, or maintaining a token blocklist.
