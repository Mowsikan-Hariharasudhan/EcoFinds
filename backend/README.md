# EcoFinds Backend API

A Node.js/Express.js backend for the EcoFinds sustainable marketplace platform with MongoDB and Socket.io.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with bcrypt password hashing
- **User Management**: Individual and business account types with profiles
- **Product Management**: CRUD operations with image upload and categorization
- **Shopping Cart**: Add/remove items, save for later, quantity management
- **Order Management**: Order creation, tracking, status updates
- **Reviews & Ratings**: Product reviews with seller responses
- **Real-time Messaging**: Socket.io powered messaging between users
- **File Uploads**: Cloudinary integration for image management
- **Analytics**: Sales, customer, and product analytics for sellers
- **Search & Filtering**: Advanced product search and filtering
- **Security**: Rate limiting, input validation, CORS, helmet protection

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:4028

   # Database
   MONGODB_URI=mongodb://localhost:27017/ecofinds

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

4. **Database Setup**
   Make sure MongoDB is running locally or use MongoDB Atlas:
   ```bash
   # Start local MongoDB (if installed locally)
   mongod
   ```

5. **Seed the Database** (Optional)
   ```bash
   npm run seed
   ```

6. **Start the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get public user profile
- `POST /api/users/:userId/follow` - Follow/unfollow user
- `GET /api/users/:userId/followers` - Get user followers
- `GET /api/users/:userId/following` - Get user following
- `GET /api/users/search` - Search users

### Product Endpoints

- `GET /api/products` - Get products with filtering/pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)
- `GET /api/products/user/:userId` - Get user's products
- `GET /api/products/:id/related` - Get related products
- `POST /api/products/:id/like` - Like/unlike product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/trending/list` - Get trending products

### Category Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/tree/all` - Get category tree
- `GET /api/categories/:id/products` - Get products by category
- `GET /api/categories/popular/list` - Get popular categories
- `GET /api/categories/search` - Search categories

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item quantity
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `GET /api/cart/summary` - Get cart summary
- `POST /api/cart/save-for-later/:itemId` - Save item for later
- `POST /api/cart/move-to-cart/:itemId` - Move saved item to cart

### Order Endpoints

- `POST /api/orders/create` - Create order from cart
- `GET /api/orders/my-orders` - Get user's orders (buyer)
- `GET /api/orders/my-sales` - Get user's sales (seller)
- `GET /api/orders/:orderId` - Get single order
- `PUT /api/orders/:orderId/status` - Update order status (seller)
- `POST /api/orders/:orderId/message` - Add message to order
- `POST /api/orders/:orderId/cancel` - Cancel order (buyer)
- `GET /api/orders/analytics/seller` - Get seller analytics

### Review Endpoints

- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (authenticated)
- `GET /api/reviews/my-reviews` - Get user's reviews
- `GET /api/reviews/seller-reviews` - Get seller's product reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/helpful` - Mark review helpful
- `POST /api/reviews/:reviewId/response` - Add seller response
- `POST /api/reviews/:reviewId/report` - Report review

### Message Endpoints

- `GET /api/messages/conversations` - Get user conversations
- `POST /api/messages/conversations` - Create/get conversation
- `GET /api/messages/conversations/:id/messages` - Get conversation messages
- `POST /api/messages/conversations/:id/messages` - Send message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message
- `GET /api/messages/unread-count` - Get unread message count

### Upload Endpoints

- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/avatar` - Upload user avatar
- `DELETE /api/upload/image/:publicId` - Delete image
- `GET /api/upload/my-files` - Get user's uploaded files

### Analytics Endpoints

- `GET /api/analytics/dashboard` - Get seller dashboard analytics
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/customers` - Get customer analytics
- `GET /api/analytics/products` - Get product analytics
- `GET /api/analytics/marketplace` - Get marketplace overview
- `GET /api/analytics/export/sales` - Export sales data

## 🗄️ Database Models

### User Model
- Authentication and profile information
- Business and individual account types
- Following/followers system
- Activity tracking

### Product Model
- Product details with images and categories
- Sustainability scoring
- Location and shipping information
- Status and visibility controls

### Category Model
- Hierarchical category structure
- Product count tracking
- Active/inactive status

### Cart Model
- Shopping cart with items
- Saved for later functionality
- Price calculations

### Order Model
- Complete order lifecycle management
- Item tracking and status updates
- Communication and timeline

### Review Model
- Product reviews and ratings
- Seller responses
- Helpful votes and reporting

### Message/Conversation Models
- Real-time messaging system
- Conversation management
- Message reactions and editing

## 🔌 Socket.io Events

### Client to Server
- `join` - Join user room for notifications
- `sendMessage` - Send real-time message
- `productUpdate` - Notify of product changes

### Server to Client
- `newMessage` - Receive new message
- `messageUpdated` - Message edit notification
- `messageDeleted` - Message deletion notification
- `productUpdated` - Product change notification

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Express Validator for all inputs
- **MongoDB Injection Protection**: Mongo sanitize middleware
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers protection

## 🧪 Testing

Sample login credentials (after running seed script):
- Business User: `john.doe@example.com / password123`
- Business User: `sarah.green@example.com / password123`
- Individual User: `mike.miller@example.com / password123`

## 📁 Project Structure

```
backend/
├── models/           # Mongoose data models
├── routes/           # Express route handlers
├── middleware/       # Custom middleware
├── scripts/         # Database seeding scripts
├── .env.example     # Environment variables template
├── server.js        # Main application entry point
└── package.json     # Dependencies and scripts
```

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up Cloudinary production account
- Configure email service credentials

### Health Check
The API includes a health check endpoint at `/api/health` for monitoring.

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling and validation
3. Include JSDoc comments for new functions
4. Test all endpoints before submitting
5. Update this README for any new features

## 📝 License

This project is licensed under the MIT License.
