# 🚗 Car Rental Agency Management System

A full-stack Car Rental Agency Management System that allows customers to browse and book rental cars while rental agencies can manage their vehicles and customer bookings.

The application provides separate workflows for customers and car rental agencies, with backend APIs and a MySQL database for managing users, vehicles, and reservations.

## ✨ Features

### 👤 Customer
- Customer registration and login.
- Browse available rental cars.
- View car details and rental pricing.
- Book rental cars.
- View and manage bookings.
- Cancel bookings.

### 🏢 Rental Agency
- Agency registration and login.
- Manage agency profile.
- Add new rental cars.
- Edit car information.
- Manage vehicle availability.
- View customer bookings.

### 🔐 Authentication & Security
- User authentication.
- Role-based access for customers and agencies.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected backend routes.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MySQL
- MySQL2

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt

### Tools
- Git
- GitHub
- VS Code
- Postman

## 📂 Project Structure

```text
Car_Rental/
│
├── client/
│   ├── HTML Pages
│   ├── css/
│   └── js/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── agencyRoutes.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   └── agencyController.js
│   │
│   ├── sql/
│   │   └── schema.sql
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🗄️ Database Design

The application uses MySQL with the following tables:

| Table | Description |
|---|---|
| users | Stores customer and agency account details |
| customer_profiles | Stores customer information |
| agency_profiles | Stores rental agency information |
| cars | Stores vehicle details and rental prices |
| bookings | Stores customer booking information |

### Database Relationships

- A user can have a customer or agency role.
- Customer profiles are linked to user accounts.
- Agency profiles are linked to user accounts.
- Agencies can manage multiple cars.
- Customers can create bookings for cars.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/NalinaDevdasMeshram/Car_Rental.git
```

### 2. Navigate to the project

```bash
cd Car_Rental
```

### 3. Setup MySQL Database

Open MySQL Workbench and execute the SQL script:

```text
server/sql/schema.sql
```

This creates the `car_rental_db` database and its required tables.

### 4. Setup Backend

```bash
cd server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the server folder.

Configure the database and server settings according to your `config/db.js` file.

Example:

```env
PORT=8080

```

### 6. Start Backend Server

```bash
npm run dev
```

The backend server runs on:

```text
http://localhost:8080
```

### 7. Run Frontend

Open the frontend entry page inside the `client` folder using your local development server or browser, according to your project configuration.

## 🔗 Backend API Routes

| Route | Purpose |
|---|---|
| `/api/auth` | User authentication |
| `/api/cars` | Car management |
| `/api/bookings` | Booking management |
| `/api/agency` | Agency management |



## 📚 Key Learning Outcomes

- Building backend applications using Node.js and Express.js.
- Designing relational databases using MySQL.
- Implementing RESTful APIs.
- Managing authentication using JWT.
- Hashing passwords using bcrypt.
- Implementing role-based access control.
- Organizing backend code using MVC architecture.
- Connecting frontend applications with backend APIs.

