# Deployment Guide

This guide details the steps to deploy the Online Lost and Found System to production.

## Prerequisites
- A MongoDB Atlas cluster (or any hosted MongoDB).
- A Cloudinary account (for image hosting).
- Node.js installed on your local machine for builds.
- A hosting provider for the backend (e.g., Render, Heroku, DigitalOcean).
- A hosting provider for the frontend (e.g., Vercel, Netlify).

## 1. Database Setup
1. Create a MongoDB Atlas cluster.
2. In Database Access, create a database user and generate a secure password.
3. In Network Access, allow access from anywhere (`0.0.0.0/0`) or whitelist your backend server IP.
4. Copy the connection string URI.

## 2. Backend Deployment (Render / Heroku)
1. Fork or push the repository to your GitHub account.
2. Create a new Web Service on your hosting provider.
3. Connect the repository.
4. Set the Root Directory to `server/`.
5. Set the Build Command: `npm install`
6. Set the Start Command: `npm start`
7. Add the following Environment Variables:
   - `PORT=5000`
   - `MONGODB_URI=<Your MongoDB Connection String>`
   - `JWT_SECRET=<A strong random string>`
   - `CLOUDINARY_CLOUD_NAME=<Your Cloudinary Name>`
   - `CLOUDINARY_API_KEY=<Your Cloudinary API Key>`
   - `CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>`
   - `CLIENT_URL=<URL of your frontend deployment>`
8. Deploy the service and note the API URL.

## 3. Frontend Deployment (Vercel / Netlify)
1. Create a new project on Vercel or Netlify.
2. Connect your GitHub repository.
3. Set the Root Directory to `client/` or `frontend/`.
4. Framework Preset: Create React App or Vite (depending on your setup).
5. Add the Environment Variables:
   - `VITE_API_BASE_URL=<Your Backend API URL>` (If using Vite)
   - `REACT_APP_API_BASE_URL=<Your Backend API URL>` (If using CRA)
6. Deploy the frontend.

## 4. Post-Deployment Checks
- Visit the frontend URL.
- Test user registration and login.
- Test uploading an image (verifies Cloudinary integration).
- Test creating a lost item (verifies DB integration).
- Check the console and network tabs in developer tools for any CORS errors.

## 5. Security & Maintenance
- Monitor MongoDB Atlas for query performance.
- Regularly rotate JWT secrets and Database passwords.
- Implement rate limiting on the backend to prevent abuse.
