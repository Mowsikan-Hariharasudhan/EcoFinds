# EcoFinds Rocket

A full-stack marketplace application where users can list and buy eco-friendly second-hand products. Built with a React + Vite + Tailwind CSS frontend and a Node.js + Express.js + MongoDB backend(local-compass).

## Features

- User authentication (sign up, login) with JWT
- Product CRUD with images (Cloudinary integration)
- Category filtering by slug
- Search, sorting, pagination, and infinite scroll
- Shopping cart and order processing
- Product reviews and ratings
- Real-time chat between buyers and sellers (Socket.io)
- Analytics dashboard for sellers
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (>= 14.x)
- npm or Yarn
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in the `backend/` folder with:

```ini
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

In the `frontend/` directory, create a `.env` file (or add to existing) with:

```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Seeding Sample Data (Optional)

To seed the database with sample users, categories, and products, run in the `backend/` folder:

```bash
npm run seed
```

## Running the Application

### Backend

```bash
cd backend
npm run dev      # starts with nodemon
```  
or
```bash
npm start        # production mode
```

### Frontend

```bash
cd frontend
npm run start    # starts Vite dev server
```

Open your browser at [http://localhost:3000](http://localhost:3000) (or the port shown) to access the app.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` – Sign up new user
  - `POST /api/auth/login`    – Log in and receive a JWT
  - `GET /api/auth/me`        – Get current user profile

- **Products**
  - `GET /api/products`       – List products (filters, pagination)
  - `GET /api/products/:id`   – Get product details
  - `POST /api/products`      – Create a product (protected)
  - `PUT /api/products/:id`   – Update a product (protected)
  - `DELETE /api/products/:id`– Delete a product (protected)

- **Categories**
  - `GET /api/categories`     – List all categories
  - `GET /api/categories/:slug`– Get products by category slug

- **Cart & Orders**
  - `GET /api/cart`           – Get current user cart (protected)
  - `POST /api/cart`          – Add/update cart item (protected)
  - `DELETE /api/cart/:id`    – Remove cart item (protected)
  - `POST /api/orders`        – Place an order (protected)
  - `GET /api/orders`         – List user orders (protected)

- **Reviews**
  - `POST /api/reviews/:productId` – Add/update review (protected)
  - `GET /api/reviews/:productId`  – List reviews for product

- **Messages**
  - `GET /api/messages/:chatId` – Get messages in chat (protected)
  - `POST /api/messages`       – Send a new message (protected)

- **Uploads**
  - `POST /api/upload`        – Upload file to Cloudinary (protected)

- **Analytics**
  - `GET /api/analytics/sellers` – Seller dashboard data (protected)


detailed API docs can be found in `backend/routes/` files.

## Project Structure

```
/ecofinds-rocket
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ seed.js
│  ├─ server.js
│  └─ .env
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ utils/
│  │  └─ App.jsx
│  ├─ tailwind.config.js
│  └─ vite.config.mjs
└─ README.md
```

## Testing & QA

- Verify all endpoints with Postman or curl.
- Log in as a seeded user: `john.doe@example.com / password123`.
- Browse categories, add items to cart, place orders, leave reviews.
- Test seller dashboard for sales analytics and message chat.

## Troubleshooting

- Ensure MongoDB URI and Cloudinary credentials are correct.
- Backend logs print errors to console—check for stack traces.
- If images 404, re-upload via `/api/upload` and update product documents.

---

Happy testing! If you encounter any issues, please report them to the team. 🎉
