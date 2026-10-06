# ApexCart | Modern Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce web application featuring a modern **React (Vite + Tailwind CSS)** user interface, an **Express.js (Node.js)** REST API backend, and comprehensive **Database Integration** (MongoDB with Mongoose, featuring zero-setup automatic in-memory fallback, cloud Atlas compatibility, and relational PostgreSQL/MySQL schemas).

---

## 🌟 Key Features

### 🛍️ Product Catalog & Discovery
- **Dynamic Catalog Grid**: Displays product cards with ratings, brand badges, pricing, and live inventory status.
- **Search & Filtering**: Search products by keyword, filter by categories (*Audio, Computers, Accessories, Wearables, Gaming, Home*), and filter by price ranges.
- **Sorting Options**: Sort by Latest Arrivals, Price: Low to High, Price: High to Low, or Customer Rating.
- **Detailed Product View**: Deep dive into specifications, high-resolution imagery, stock levels, quantity selector, and instant buy-now controls.

### 🛒 Shopping Cart & Calculation Engine
- **Stock-Aware Cart**: Real-time validation against available inventory; prevents selecting more than available stock.
- **Interactive Controls**: Seamless quantity adjustments, item removals, and one-click cart clearing.
- **Financial Breakdown**: Instant reactive subtotal calculation, free shipping qualification meter (free shipping on orders over \$100), estimated sales tax (8%), and order grand total.
- **Persistent State**: Persisted across browser sessions using `localStorage`.

### 💳 Multi-Step Checkout Flow
- **Step 1 - Shipping Address**: Form with full validation (recipient name, address, city, postal code, country, phone). Pre-populates stored user address.
- **Step 2 - Payment Method**: Choose between Credit/Debit Card (mock simulation), UPI / NetBanking, or Cash on Delivery (COD).
- **Step 3 - Order Review & Confirmation**: Complete breakdown review before finalizing the transaction.
- **Real-Time Stock Deduction**: Automatically decrements product stock in the database upon order placement.
- **Order Confirmation Receipt**: Generates unique Order ID with itemized invoice and fulfillment tracking.

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **Secure Authentication**: JWT (JSON Web Tokens) with 30-day validity and bcrypt password hashing (salt rounds: 10).
- **Role-Based Guards**:
  - **`User`**: Browse catalog, manage personal cart, execute checkout, and review personal order history at `/orders`.
  - **`Admin`**: Exclusive access to `/admin/dashboard`, `/admin/products` (full CRUD modal), and `/admin/orders` (live status dropdowns).
- **⚡ 1-Click Evaluation Accounts**: Pre-configured demo buttons on the login screen for instantaneous testing without manual typing.

### 📊 Admin Portal & Operations
- **Executive Analytics Dashboard**: Real-time KPI summary cards for Gross Revenue, Order Count, Total SKUs, and Low Stock alerts (inventory &le; 5 units).
- **Product Inventory Management**: Searchable catalog table with live stock badges, Add/Edit modal dialog, and deletion controls.
- **Order Status Management**: Interactive order status advancement (`Pending` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered` &rarr; `Cancelled`). Automatically adjusts inventory upon order cancellation.

---

## 🧱 Architecture & Project Structure

```
moch/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient DB connection with in-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile updates
│   │   │   ├── productController.js  # Catalog listing, filters, search, admin CRUD
│   │   │   ├── orderController.js    # Stock verification, checkout, user orders
│   │   │   └── adminController.js    # Executive stats, all orders, status updates
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification ('protect') & admin role guard ('adminOnly')
│   │   │   └── errorMiddleware.js    # 404 handler and JSON error responses
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt password hashing
│   │   │   ├── Product.js            # Product schema with search indexing
│   │   │   └── Order.js              # Order schema with nested line items & status lifecycle
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── productRoutes.js      # /api/products endpoints
│   │   │   ├── orderRoutes.js        # /api/orders endpoints
│   │   │   └── adminRoutes.js        # /api/admin endpoints
│   │   ├── seed/
│   │   │   ├── productsData.js       # Curated initial catalog items & users
│   │   │   └── seeder.js             # Seeding CLI script & auto-seed on startup
│   │   ├── utils/
│   │   │   └── generateToken.js      # Signed JWT helper
│   │   └── server.js                 # Express server with CORS & routing
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js          # Axios client with automatic Bearer token injection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state, login/register/logout handlers
│   │   │   └── CartContext.jsx       # Reactive shopping cart & financial calculation engine
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Brand, search, cart counter, auth dropdown
│   │   │   ├── Footer.jsx            # Value propositions & architecture info
│   │   │   ├── ProductCard.jsx       # Responsive item card with quick-add
│   │   │   ├── StatusBadge.jsx       # Order lifecycle status pills
│   │   │   └── ProtectedRoute.jsx    # Client-side RBAC route protector
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Catalog, category filters, sorting, pagination
│   │   │   ├── ProductDetailPage.jsx # Full product specs & direct checkout
│   │   │   ├── CartPage.jsx          # Shopping cart overview
│   │   │   ├── CheckoutPage.jsx      # 3-step checkout wizard
│   │   │   ├── OrderSuccessPage.jsx  # Order confirmation receipt & invoice
│   │   │   ├── OrderHistoryPage.jsx  # Customer order history
│   │   │   ├── LoginPage.jsx         # Login form with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx      # Registration form
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx# KPI metrics & recent orders
│   │   │       ├── AdminProducts.jsx # Product CRUD table & modal
│   │   │       └── AdminOrders.jsx   # All customer orders & status changer
│   │   ├── App.jsx                   # React Router routing configuration
│   │   └── main.jsx
│   ├── vite.config.js                # Vite build configuration with API proxy
│   └── package.json
├── docs/
│   └── database-schema.sql           # Complete PostgreSQL / MySQL relational DDL
├── package.json                      # Root orchestration scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)

### 2. Install Dependencies
Run the following from the root directory:
```bash
# Install root, backend, and frontend packages in one command:
npm run install:all
```
*(Or individually `npm install` inside `/backend` and `/frontend`)*

### 3. Start Development Servers
To run both backend API (`http://localhost:5000`) and frontend client (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend API
npm run server

# Terminal 2: Frontend Client
npm run client
```

Then open your browser at **`http://localhost:3000`**.

---

## 🔑 Demo Login Credentials

The application provides **1-click login buttons** directly on the `/login` page for fast evaluation:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `adminpassword123` | Full access to `/admin` dashboard, Product CRUD, Order Status modification, Catalog & Checkout |
| **Customer** | `user@example.com` | `userpassword123` | Browsing, Cart, Multi-step Checkout, Order History (`/orders`), Profile |

---

## 🗄️ Database Integration Options

### Option A: Automatic Zero-Setup Fallback (Default)
If no external database is configured, the backend starts an embedded in-memory MongoDB server (`mongodb-memory-server`) and automatically populates the catalog with rich seed products and demo accounts. **Zero manual installation needed.**

### Option B: Local MongoDB or MongoDB Atlas Cloud
Set `MONGODB_URI` in `backend/.env`:
```env
# Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db

# MongoDB Atlas (Cloud Sandbox):
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_db?retryWrites=true&w=majority
```

### Option C: PostgreSQL / MySQL Relational Schema
For SQL-based environments, complete DDL schemas, indexing, and foreign key relationships are provided in:
- [`docs/database-schema.sql`](docs/database-schema.sql)

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new customer
- `POST /api/auth/login` - Authenticate with email & password, returns JWT
- `GET /api/auth/profile` - Get logged-in user profile (*Private*)
- `PUT /api/auth/profile` - Update profile information (*Private*)

### Product Catalog (`/api/products`)
- `GET /api/products` - List products with `keyword`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` (*Public*)
- `GET /api/products/categories` - Fetch all categories with item counts (*Public*)
- `GET /api/products/:id` - Fetch product details by ID (*Public*)
- `POST /api/products` - Create new product (*Admin Only*)
- `PUT /api/products/:id` - Update product details (*Admin Only*)
- `DELETE /api/products/:id` - Delete product (*Admin Only*)

### Orders & Checkout (`/api/orders`)
- `POST /api/orders` - Place new order & decrement stock inventory (*Private*)
- `GET /api/orders/myorders` - Fetch customer's own order history (*Private*)
- `GET /api/orders/:id` - Get order receipt by ID (*Owner or Admin*)
- `PUT /api/orders/:id/pay` - Mark order as paid (*Private*)

### Admin Operations (`/api/admin`)
- `GET /api/admin/stats` - Summary KPI metrics (revenue, orders, low-stock warnings) (*Admin Only*)
- `GET /api/admin/orders` - View all orders across all customers with filter (*Admin Only*)
- `PUT /api/admin/orders/:id/status` - Advance order lifecycle status (*Admin Only*)
- `GET /api/admin/users` - View all registered users (*Admin Only*)

---

## 🧪 Testing & Verification

1. **Verify Backend Health**:
   ```bash
   curl http://localhost:5000/api/health
   ```
2. **Re-seed Catalog**:
   ```bash
   npm run seed --prefix backend
   ```
3. **Build Frontend**:
   ```bash
   npm run build --prefix frontend
   ```
