# 🌟 DaanDrishti - Transparent NGO Donation Platform

A comprehensive full-stack web application that connects donors with verified NGOs, ensuring complete transparency in charitable giving and donation tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Key Features by Role](#key-features-by-role)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DonateTrack is a modern donation management platform that bridges the gap between donors and NGOs, providing:

- **Transparency**: Real-time tracking of how donations are spent
- **Verification**: Admin-verified NGO registrations
- **Security**: Secure payment processing via Razorpay
- **Accountability**: Detailed spending reports and analytics
- **Social Impact**: Community events and engagement features

## ✨ Features

### For Donors

- 💳 Secure online donations with multiple payment options
- 📊 Track donation history with PDF export functionality
- 🔍 Browse verified NGOs with detailed profiles
- 📈 View real-time impact of donations through spending reports
- 🎯 Filter NGOs by category, location, and impact areas
- 🔔 Social event participation and updates

### For NGOs

- 📝 Complete registration and profile management
- 💰 Receive and manage donations
- 📄 Submit transparent spending reports with receipts
- 📊 Access analytics dashboard
- 🗓️ Create and manage social events
- 📸 Upload documents and impact photos

### For Admins

- ✅ Verify and approve NGO registrations
- 👥 Manage all users (donors, NGOs)
- 📊 System-wide analytics and reporting
- 🔍 Review spending reports and documentation
- 🚫 Suspend/activate accounts
- 📈 Monitor platform activity

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Payment Gateway**: Razorpay
- **File Upload**: Multer
- **Validation**: express-validator
- **Logging**: Morgan

## 📁 Project Structure

```
NGO_MSC/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── donorController.js    # Donor operations
│   │   ├── ngoController.js      # NGO operations
│   │   ├── paymentController.js  # Payment processing
│   │   ├── publicController.js   # Public endpoints
│   │   └── socialEventController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   └── roleMiddleware.js     # Role-based access
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── NGO.js                # NGO schema
│   │   ├── Donation.js           # Donation schema
│   │   ├── Spending.js           # Spending reports
│   │   ├── Report.js             # Reports schema
│   │   └── SocialEvent.js        # Events schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── ngoRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── publicRoutes.js
│   │   └── socialEventRoutes.js
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   ├── sendEmail.js          # Email service
│   │   └── upload.js             # File upload config
│   ├── server.js                 # Express app entry
│   ├── package.json
│   └── ENV_EXAMPLE.txt
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── layout/           # Layout components
│   │   │   └── DonateModal.tsx   # Donation modal
│   │   ├── pages/
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── donor/            # Donor pages
│   │   │   ├── ngo/              # NGO pages
│   │   │   ├── Index.tsx         # Landing page
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── NGOListing.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Auth state management
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── adminService.ts
│   │   │   ├── donorService.ts
│   │   │   ├── ngoService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── publicService.ts
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   └── utils.ts          # Utility functions
│   │   ├── hooks/                # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher) - Local installation or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** (for version control)
- **Razorpay Account** (for payment integration)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Cheeku29/MSC_NGO.git
cd NGO_MSC
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ENV_EXAMPLE.txt .env

# Edit .env file with your configurations
# (See Environment Configuration section below)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd Frontend

# Install dependencies
npm install
```

## 🔧 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fund-trust
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatetrack

# JWT Secrets (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration

Update the API base URL in `Frontend/src/lib/api.ts` if needed:

```typescript
const API_BASE_URL = "http://localhost:5000/api";
```

## ▶️ Running the Application

### Start MongoDB (if running locally)

```bash
# Windows
mongod

# macOS/Linux
sudo service mongod start
```

### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# From Frontend directory
cd Frontend

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or the next available port)

### Build for Production

```bash
# Frontend production build
cd Frontend
npm run build

# Preview production build
npm run preview
```

## 👥 User Roles & Permissions

### 1. Donor

- Register and create profile
- Browse and search NGOs
- Make donations
- View donation history
- Export donation records as PDF
- Participate in social events

### 2. NGO

- Register organization with verification documents
- Wait for admin approval
- Receive donations
- Submit spending reports with receipts
- Create social events
- Manage organization profile

### 3. Admin

- Full system access
- Verify NGO registrations
- Manage all users
- Review spending reports
- Access system analytics
- Moderate platform content

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/refresh         - Refresh JWT token
GET    /api/auth/profile         - Get user profile
PUT    /api/auth/profile         - Update user profile
```

### Donor Endpoints

```
GET    /api/donor/donations      - Get donation history
GET    /api/donor/ngos           - Browse NGOs
POST   /api/donor/donate         - Make donation
```

### NGO Endpoints

```
GET    /api/ngo/profile          - Get NGO profile
PUT    /api/ngo/profile          - Update NGO profile
POST   /api/ngo/spending         - Submit spending report
GET    /api/ngo/donations        - Get received donations
POST   /api/ngo/events           - Create social event
```

### Admin Endpoints

```
GET    /api/admin/ngos           - Get all NGOs
PUT    /api/admin/verify/:id     - Verify NGO
GET    /api/admin/users          - Get all users
PUT    /api/admin/user/:id       - Update user status
GET    /api/admin/analytics      - System analytics
```

### Payment Endpoints

```
POST   /api/payment/create-order - Create Razorpay order
POST   /api/payment/verify       - Verify payment
```

### Public Endpoints

```
GET    /api/public/ngos          - Browse NGOs (public)
GET    /api/public/events        - Get social events
GET    /api/public/stats         - Platform statistics
```

## 🎯 Key Features by Role

### Donor Dashboard

- **Overview**: Total donations, NGOs supported, impact metrics
- **My Donations**: Complete history with search, filter, and PDF export
- **Browse NGOs**: Searchable list with detailed profiles
- **Social Events**: Upcoming events and participation

### NGO Dashboard

- **Dashboard**: Total donations received, spending reports, analytics
- **Manage Profile**: Update organization details and documents
- **Spending Reports**: Submit transparent expense reports with receipts
- **Social Events**: Create and manage community events
- **Donation History**: View all received donations

### Admin Dashboard

- **System Overview**: Platform-wide statistics and metrics
- **Verify NGOs**: Review pending registrations with document verification
- **Manage NGOs**: View all NGOs with approval status
- **Manage Users**: User management and account controls
- **Reports Review**: Approve/reject spending reports

## 💳 Payment Integration

DonateTrack uses **Razorpay** for secure payment processing:

1. **Setup Razorpay Account**:

   - Sign up at [razorpay.com](https://razorpay.com)
   - Get API keys from Dashboard > Settings > API Keys
   - Add keys to backend `.env` file

2. **Test Mode**:

   - Use test API keys for development
   - Test card: 4111 1111 1111 1111
   - Any future expiry date and CVV

3. **Production**:
   - Complete KYC verification
   - Switch to live API keys
   - Configure webhooks for payment notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-Based Access Control**: Middleware-based permission system
- **Input Validation**: express-validator for request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection
- **File Upload Security**: Multer with file type restrictions

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd Frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Cheeku29**

- GitHub: [@Cheeku29](https://github.com/Cheeku29)
- Repository: [MSC_NGO](https://github.com/Cheeku29/MSC_NGO)

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Radix UI** for accessible component primitives
- **Razorpay** for payment gateway integration
- **MongoDB** for database solution
- **Vite** for lightning-fast development experience

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for transparent charitable giving**

# 🌟 DonateTrack - Transparent NGO Donation Platform

A comprehensive full-stack web application that connects donors with verified NGOs, ensuring complete transparency in charitable giving and donation tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Key Features by Role](#key-features-by-role)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DonateTrack is a modern donation management platform that bridges the gap between donors and NGOs, providing:

- **Transparency**: Real-time tracking of how donations are spent
- **Verification**: Admin-verified NGO registrations
- **Security**: Secure payment processing via Razorpay
- **Accountability**: Detailed spending reports and analytics
- **Social Impact**: Community events and engagement features

## ✨ Features

### For Donors

- 💳 Secure online donations with multiple payment options
- 📊 Track donation history with PDF export functionality
- 🔍 Browse verified NGOs with detailed profiles
- 📈 View real-time impact of donations through spending reports
- 🎯 Filter NGOs by category, location, and impact areas
- 🔔 Social event participation and updates

### For NGOs

- 📝 Complete registration and profile management
- 💰 Receive and manage donations
- 📄 Submit transparent spending reports with receipts
- 📊 Access analytics dashboard
- 🗓️ Create and manage social events
- 📸 Upload documents and impact photos

### For Admins

- ✅ Verify and approve NGO registrations
- 👥 Manage all users (donors, NGOs)
- 📊 System-wide analytics and reporting
- 🔍 Review spending reports and documentation
- 🚫 Suspend/activate accounts
- 📈 Monitor platform activity

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Payment Gateway**: Razorpay
- **File Upload**: Multer
- **Validation**: express-validator
- **Logging**: Morgan

## 📁 Project Structure

```
NGO_MSC/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── donorController.js    # Donor operations
│   │   ├── ngoController.js      # NGO operations
│   │   ├── paymentController.js  # Payment processing
│   │   ├── publicController.js   # Public endpoints
│   │   └── socialEventController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   └── roleMiddleware.js     # Role-based access
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── NGO.js                # NGO schema
│   │   ├── Donation.js           # Donation schema
│   │   ├── Spending.js           # Spending reports
│   │   ├── Report.js             # Reports schema
│   │   └── SocialEvent.js        # Events schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── ngoRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── publicRoutes.js
│   │   └── socialEventRoutes.js
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   ├── sendEmail.js          # Email service
│   │   └── upload.js             # File upload config
│   ├── server.js                 # Express app entry
│   ├── package.json
│   └── ENV_EXAMPLE.txt
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── layout/           # Layout components
│   │   │   └── DonateModal.tsx   # Donation modal
│   │   ├── pages/
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── donor/            # Donor pages
│   │   │   ├── ngo/              # NGO pages
│   │   │   ├── Index.tsx         # Landing page
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── NGOListing.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Auth state management
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── adminService.ts
│   │   │   ├── donorService.ts
│   │   │   ├── ngoService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── publicService.ts
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   └── utils.ts          # Utility functions
│   │   ├── hooks/                # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher) - Local installation or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** (for version control)
- **Razorpay Account** (for payment integration)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Cheeku29/MSC_NGO.git
cd NGO_MSC
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ENV_EXAMPLE.txt .env

# Edit .env file with your configurations
# (See Environment Configuration section below)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd Frontend

# Install dependencies
npm install
```

## 🔧 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fund-trust
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatetrack

# JWT Secrets (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration

Update the API base URL in `Frontend/src/lib/api.ts` if needed:

```typescript
const API_BASE_URL = "http://localhost:5000/api";
```

## ▶️ Running the Application

### Start MongoDB (if running locally)

```bash
# Windows
mongod

# macOS/Linux
sudo service mongod start
```

### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# From Frontend directory
cd Frontend

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or the next available port)

### Build for Production

```bash
# Frontend production build
cd Frontend
npm run build

# Preview production build
npm run preview
```

## 👥 User Roles & Permissions

### 1. Donor

- Register and create profile
- Browse and search NGOs
- Make donations
- View donation history
- Export donation records as PDF
- Participate in social events

### 2. NGO

- Register organization with verification documents
- Wait for admin approval
- Receive donations
- Submit spending reports with receipts
- Create social events
- Manage organization profile

### 3. Admin

- Full system access
- Verify NGO registrations
- Manage all users
- Review spending reports
- Access system analytics
- Moderate platform content

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/refresh         - Refresh JWT token
GET    /api/auth/profile         - Get user profile
PUT    /api/auth/profile         - Update user profile
```

### Donor Endpoints

```
GET    /api/donor/donations      - Get donation history
GET    /api/donor/ngos           - Browse NGOs
POST   /api/donor/donate         - Make donation
```

### NGO Endpoints

```
GET    /api/ngo/profile          - Get NGO profile
PUT    /api/ngo/profile          - Update NGO profile
POST   /api/ngo/spending         - Submit spending report
GET    /api/ngo/donations        - Get received donations
POST   /api/ngo/events           - Create social event
```

### Admin Endpoints

```
GET    /api/admin/ngos           - Get all NGOs
PUT    /api/admin/verify/:id     - Verify NGO
GET    /api/admin/users          - Get all users
PUT    /api/admin/user/:id       - Update user status
GET    /api/admin/analytics      - System analytics
```

### Payment Endpoints

```
POST   /api/payment/create-order - Create Razorpay order
POST   /api/payment/verify       - Verify payment
```

### Public Endpoints

```
GET    /api/public/ngos          - Browse NGOs (public)
GET    /api/public/events        - Get social events
GET    /api/public/stats         - Platform statistics
```

## 🎯 Key Features by Role

### Donor Dashboard

- **Overview**: Total donations, NGOs supported, impact metrics
- **My Donations**: Complete history with search, filter, and PDF export
- **Browse NGOs**: Searchable list with detailed profiles
- **Social Events**: Upcoming events and participation

### NGO Dashboard

- **Dashboard**: Total donations received, spending reports, analytics
- **Manage Profile**: Update organization details and documents
- **Spending Reports**: Submit transparent expense reports with receipts
- **Social Events**: Create and manage community events
- **Donation History**: View all received donations

### Admin Dashboard

- **System Overview**: Platform-wide statistics and metrics
- **Verify NGOs**: Review pending registrations with document verification
- **Manage NGOs**: View all NGOs with approval status
- **Manage Users**: User management and account controls
- **Reports Review**: Approve/reject spending reports

## 💳 Payment Integration

DonateTrack uses **Razorpay** for secure payment processing:

1. **Setup Razorpay Account**:

   - Sign up at [razorpay.com](https://razorpay.com)
   - Get API keys from Dashboard > Settings > API Keys
   - Add keys to backend `.env` file

2. **Test Mode**:

   - Use test API keys for development
   - Test card: 4111 1111 1111 1111
   - Any future expiry date and CVV

3. **Production**:
   - Complete KYC verification
   - Switch to live API keys
   - Configure webhooks for payment notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-Based Access Control**: Middleware-based permission system
- **Input Validation**: express-validator for request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection
- **File Upload Security**: Multer with file type restrictions

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd Frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Cheeku29**

- GitHub: [@Cheeku29](https://github.com/Cheeku29)
- Repository: [MSC_NGO](https://github.com/Cheeku29/MSC_NGO)

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Radix UI** for accessible component primitives
- **Razorpay** for payment gateway integration
- **MongoDB** for database solution
- **Vite** for lightning-fast development experience

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for transparent charitable giving**
