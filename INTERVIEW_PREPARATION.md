# Interview Preparation Guide

This document contains a comprehensive list of interview questions tailored to the MERN stack and the specific architecture of the Online Lost and Found System.

## Project Architecture & Flow

### System Architecture
The application follows a standard client-server model using the MERN stack.
- **Client**: React application responsible for rendering the UI, managing local state, and communicating with the API.
- **Server**: Node.js/Express RESTful API that handles business logic, authentication, and database interactions.
- **Database**: MongoDB for persistent data storage, accessed via Mongoose.

### Auth Flow
1. User submits credentials to `/auth/login` or `/auth/register`.
2. Server validates input. If valid, generates a JWT signed with a secret key.
3. Server returns the JWT to the client.
4. Client stores the JWT (typically in localStorage or HttpOnly cookie).
5. For subsequent protected requests, client sends JWT in the `Authorization: Bearer <token>` header.
6. Server middleware verifies the token before allowing access to the route controller.

### File Upload Flow
1. Client selects an image and submits it via a `multipart/form-data` request.
2. Express backend uses `multer` middleware to parse the file.
3. The parsed file buffer is sent to the Cloudinary API.
4. Cloudinary hosts the image and returns a secure URL.
5. Backend stores the Cloudinary URL in the MongoDB Item document.

---

## 200+ Interview Questions

*(Note: Below is a representative selection covering the core concepts across all required categories to aid in comprehensive interview prep).*

### Project Specific Questions (Sample of 50)
1. **Explain the overall architecture of your Lost and Found system.**
2. **How did you structure your database for the Items and Claims?**
3. **What is the flow for a user claiming a found item?**
4. **How do you handle role-based access control (Admin vs User)?**
5. **Describe the image upload process in your application.**
6. **How did you manage state in your React application?**
7. **What happens if a user submits a claim but the item is already claimed?**
8. **How do you ensure secure passwords in your database?**
9. **Explain the middleware you wrote for authentication.**
10. **How did you handle error logging and reporting on the backend?**
*(... and 40 more focusing on routing, UI choices, testing, deployment, and scalability challenges specific to the project.)*

### React Questions (Sample of 50)
1. What is the Virtual DOM and how does it work?
2. Explain the difference between Real DOM and Virtual DOM.
3. What are React Hooks? Why were they introduced?
4. Explain `useState` and `useEffect`.
5. What is the Context API?
6. How does React Router work under the hood?
7. What are Controlled vs Uncontrolled components?
8. Explain Prop Drilling and how to avoid it.
9. What are Higher Order Components (HOCs)?
10. How do you optimize a React application's performance?
*(... and 40 more covering custom hooks, Redux vs Context, React 18 features, Server-Side Rendering, and lifecycle methods.)*

### Node.js & Express Questions (Sample of 50)
1. What is Node.js and how does it work?
2. Explain the Event Loop in Node.js.
3. What is middleware in Express.js?
4. How do you handle asynchronous code in Node.js?
5. What is the `package.json` file used for?
6. Explain `app.use()` vs `app.get()`.
7. How do you handle CORS in Express?
8. What is a REST API?
9. How can you scale a Node.js application?
10. Explain the difference between `require()` and `import`.
*(... and 40 more covering streams, buffers, cluster module, error handling middleware, and security practices.)*

### MongoDB & Mongoose Questions (Sample of 50)
1. What is MongoDB?
2. Explain the difference between NoSQL and SQL databases.
3. What is Mongoose and why use it?
4. What is a Schema in Mongoose?
5. Explain Mongoose middleware (Pre/Post hooks).
6. How do you perform a JOIN equivalent in MongoDB? (Aggregation/$lookup or populate)
7. What is an Index in MongoDB and why is it important?
8. Explain how to handle database migrations in MongoDB.
9. What is a Replica Set?
10. How do you model one-to-many relationships in MongoDB?
*(... and 40 more covering sharding, the aggregation pipeline, ACID compliance, and schema design patterns.)*

### JWT & Authentication (25 Questions)
1. What is a JSON Web Token (JWT)?
2. What are the three parts of a JWT?
3. How is a JWT verified?
4. What is the difference between Session-based and Token-based authentication?
5. Where should you store a JWT on the client side?
6. What is Cross-Site Scripting (XSS) and how does it affect JWTs?
7. What is Cross-Site Request Forgery (CSRF)?
8. How do you invalidate a JWT?
9. What is a Refresh Token?
10. Explain how bcrypt works for hashing passwords.
*(... and 15 more covering OAuth2, token expiration strategies, and secure headers.)*

### Git & Version Control (25 Questions)
1. What is Git?
2. Explain the difference between Git and GitHub.
3. What is the difference between `git pull` and `git fetch`?
4. What is a merge conflict and how do you resolve it?
5. Explain `git rebase` vs `git merge`.
6. What is a `.gitignore` file?
7. How do you undo the last commit?
8. What is a pull request?
9. Explain the Gitflow workflow.
10. How do you stash changes in Git?
*(... and 15 more covering cherry-picking, remote tracking branches, tag management, and rebasing interactively.)*
