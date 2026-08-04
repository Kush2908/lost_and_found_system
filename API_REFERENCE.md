# API Reference

Base URL: `/api/v1`

## Authentication (`/auth`)

### `POST /auth/register`
Register a new user.
- **Body**: `{ name, email, password, contactNumber }`
- **Response**: `201 Created` - Returns user object and JWT token.

### `POST /auth/login`
Authenticate an existing user.
- **Body**: `{ email, password }`
- **Response**: `200 OK` - Returns user object and JWT token.

### `GET /auth/me`
Get current logged-in user details.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` - Returns user object.

## Items (`/items`)

### `GET /items`
Retrieve a paginated list of lost/found items.
- **Query Params**: `type (lost|found)`, `category`, `status`, `page`, `limit`
- **Response**: `200 OK` - List of items and pagination metadata.

### `GET /items/:id`
Retrieve a specific item by ID.
- **Response**: `200 OK` - Item object.

### `POST /items`
Report a new lost or found item.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ type, title, description, category, location, dateLostOrFound, images }`
- **Response**: `201 Created` - Created item object.

### `PUT /items/:id`
Update an item (must be reporter or admin).
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Fields to update.
- **Response**: `200 OK` - Updated item object.

### `DELETE /items/:id`
Delete an item (must be reporter or admin).
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` - Success message.

## Claims (`/claims`)

### `POST /claims`
Submit a claim for an item.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ itemId, proofDescription, proofImages }`
- **Response**: `201 Created` - Created claim object.

### `GET /claims/my-claims`
Get claims submitted by the current user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` - List of claims.

## Admin (`/admin`)

*(All routes require `Authorization: Bearer <token>` of an admin user)*

### `GET /admin/stats`
Get system statistics (total items, resolved claims, active users).
- **Response**: `200 OK` - Stats object.

### `GET /admin/claims`
List all claims for review.
- **Query Params**: `status (pending|approved|rejected)`
- **Response**: `200 OK` - List of claims with populated item and user data.

### `PATCH /admin/claims/:id/status`
Approve or reject a claim.
- **Body**: `{ status: 'approved' | 'rejected', adminNotes }`
- **Response**: `200 OK` - Updated claim object.
