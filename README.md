# Enterprise Hotel Management System (Node.js + Express + EJS + MySQL)

A **production-ready, enterprise-level Hotel Management System** built with **Node.js, Express.js, EJS, MySQL (Sequelize ORM), Bootstrap 5, FontAwesome 6, Chart.js, Multer, bcrypt, and express-session**.

---

## 🚀 System Features

### 👤 Guest Features
- **Landing Showcase**: High-res room gallery, amenity highlights, and live availability search.
- **Room Catalog & Live Filter**: Filter accommodations by category (`Single`, `Double`, `Deluxe`, `Family`, `Suite`), max price, and availability.
- **In-Room Dining Menu**: Gourmet food items categorized by `Breakfast`, `Lunch & Dinner`, `Beverages`, and `Desserts`.
- **Guest Authentication**: Sign in and registration with password hashing (`bcrypt`).

### 📱 Customer Portal
- **Dashboard**: View active check-in details, room service orders, and maintenance tickets.
- **Online Room Reservation**: Select check-in/out dates, calculate GST + service charges, select payment method (`Credit Card`, `UPI`, `Cash`), and receive instant confirmation.
- **In-Room Food Ordering**: Interactive AJAX cart for room service orders with real-time status tracking (`Pending` -> `Accepted` -> `Preparing` -> `Ready` -> `Delivered` -> `Completed`).
- **Room Service Complaints**: Raise room maintenance tickets (`AC`, `WiFi`, `Water`, `Cleaning`) and track staff resolution notes.
- **PDF Invoice Download**: Generate itemized PDF invoices & receipts.

### 🛡️ Admin Portal (Executive Command Center)
- **Executive Analytics Dashboard**: Real-time room metrics, revenue calculations, occupancy breakdown, and **Chart.js** performance graphs.
- **Room Inventory Management**: Full CRUD operations for rooms, multiple image uploads via Multer, pricing, capacity, and status changes (`Available`, `Reserved`, `Booked`, `Occupied`, `Cleaning`, `Maintenance`, `Out of Service`).
- **Offline Walk-In Booking Wizard**: Register walk-in guests at reception, assign available rooms, process immediate Cash/Card/UPI payments, print receipts, and auto-check in.
- **Automatic Room Re-availability**: **Rooms automatically reset to `Available` state upon guest check-out!**
- **Room Service Kitchen Pipeline**: Manage and update food order pipeline statuses.
- **Complaint Resolution Desk**: Assign staff members to complaints and record resolution notes.
- **Financial Reports**: Audit trails of payments, GST calculations, and booking logs.

---

## 🛠️ Technology Stack & Architecture

- **Backend**: Node.js, Express.js
- **View Engine**: EJS with layout partials
- **Database / ORM**: MySQL with Sequelize ORM (Automatic SQLite fallback for zero-setup execution)
- **Authentication**: `express-session` & `bcryptjs`
- **Security**: `helmet`, `cors`, `express-rate-limit`, input sanitization, audit logging
- **PDF Generation**: `pdfkit`
- **File Uploads**: `multer`
- **Frontend UI**: Bootstrap 5, FontAwesome 6, Chart.js, Vanilla JS (Fetch API AJAX)

---

## 🔑 Demo Access Credentials

| Role | Email | Password |
|---|---|---|
| **Executive Admin** | `admin@grandhaven.com` | `admin123` |
| **Registered Customer** | `customer@grandhaven.com` | `customer123` |
| **Hotel Staff** | `staff@grandhaven.com` | `staff123` |

---

## 💻 Installation & Quickstart

1. **Clone Repository**:
   ```bash
   git clone https://github.com/jaswanthraghuram/hotel-management.git
   cd hotel-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=grandhaven_resort_secret_key_2026!

   # MySQL Configuration (Optional: system auto-falls back to SQLite if MySQL daemon is absent)
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=hotelmanagement_db
   DB_PORT=3306
   DB_DIALECT=mysql
   ```

4. **Seed Database & Launch Server**:
   ```bash
   npm run start
   ```
   *Access the web application at:* **`http://localhost:3000/`**

---

## 🗄️ Database Schemas & Relations

- `users` (id, roleId, fullName, email, phone, password, address, idProof, status)
- `roles` (id, name, description)
- `rooms` (id, roomNumber, roomTypeId, floor, price, status, isBookable)
- `room_types` (id, name, basePrice, capacity, description, amenities)
- `room_images` (id, roomId, imageUrl, isPrimary)
- `bookings` (id, bookingNumber, userId, customerName, customerEmail, customerPhone, bookingType, checkInDate, checkOutDate, status, totalAmount)
- `booking_details` (id, bookingId, roomId, pricePerNight, nights, subtotal)
- `payments` (id, bookingId, paymentNumber, amount, paymentMethod, paymentStatus, gstAmount, serviceCharge, discount, finalTotal)
- `food_categories` (id, name, description, icon)
- `food_menu` (id, foodCategoryId, name, description, price, isAvailable)
- `food_orders` (id, orderNumber, userId, roomId, status, totalAmount)
- `food_order_items` (id, foodOrderId, foodItemId, foodItemName, quantity, price, subtotal)
- `complaints` (id, complaintNumber, userId, roomId, category, description, status, assignedStaffId, resolutionNotes)
- `reviews` (id, userId, userName, rating, comment, isApproved)
- `notifications` (id, userId, title, message, isRead)
- `audit_logs` (id, userId, action, details, ipAddress)
