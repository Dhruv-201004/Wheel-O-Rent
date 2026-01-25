# Wheel-o-Rent

**Wheel-o-Rent** is a full-stack MERN application for short-term rentals of two- and four-wheelers. It offers real-time availability, simple booking, and role-based access control for students, admins, and vehicle owners. Designed for affordability and a seamless user experience.

🔗 **Live Demo:** [wheel-o-rent.vercel.app](https://wheel-o-rent.vercel.app)  

---

## 🚀 Features
- **Real-Time Availability** – Instantly view available vehicles.
- **Effortless Booking** – Quick and intuitive booking process.
- **Role-Based Access Control (RBAC):**
  - **Students:** Browse and book vehicles, manage bookings, view profile.
  - **Admins:** Comprehensive dashboard with user/car/booking management, maintenance mode control.
  - **Vehicle Owners:** List and manage vehicles, track bookings, dashboard with statistics.
- **Admin Dashboard** – Premium interface with:
  - 📊 Real-time statistics (users, owners, cars, revenue)
  - 👥 User management with admin role assignment
  - 🚗 Car inventory management
  - 📅 Booking management with status updates
  - ⚙️ Maintenance mode toggle
- **User Profile Management** – Edit profile, upload images (URL or file), manage account.
- **Image Upload** – Integration with ImageKit for cloud image storage.
- **Maintenance Mode** – Admin-controlled system maintenance with user blocking.
- **Responsive UI** – Optimized for mobile and desktop.
- **Modern Tech Stack** – MERN (MongoDB, Express.js, React.js, Node.js).

---

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, React Router, Axios, React Hot Toast, Motion/React
- **Backend:** Node.js, Express.js, JWT Authentication, Multer  
- **Database:** MongoDB Atlas  
- **Cloud Services:** ImageKit (Image Hosting & Management)
- **Tools & Libraries:** Figma (UI Design), Vercel (Deployment), GitHub (Version Control)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Dhruv-201004/Wheel-O-Rent.git
cd Wheel-O-Rent
````

### 2. Install dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder with your configuration:
- `MONGODB_URL` – MongoDB connection string
- `JWT_SECRET` – Secret key for JWT tokens
- `IMAGEKIT_PUBLIC_KEY` – ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` – ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` – ImageKit URL endpoint
- `PORT` – Server port (default: 3000)

Create a `.env.local` file inside the `client` folder with your configuration:
- `VITE_CURRENCY` – Currency symbol (e.g., $)
- `VITE_BASE_URL` – Backend API base URL

### 4. Run the development servers

```bash
# Run backend server (from server directory)
cd server
npm start

# Run frontend client (from client directory)
cd client
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Key Features Breakdown

### 🏠 **User Features**
- Browse available vehicles with filters
- View detailed car information
- Book vehicles with date selection
- Manage active bookings and booking history
- Edit profile with image upload capability
- View account details and role information

### 👨‍💼 **Owner Features**
- Dashboard with statistics
- Add and manage vehicles
- Track bookings for owned cars
- Manage booking status
- View revenue and performance metrics

### 🔐 **Admin Features**
- **Dashboard Statistics** – Real-time platform metrics
  - Total users, owners, cars, and revenue
  - Booking statistics (confirmed, pending, cancelled)
- **User Management** – Promote/demote admin roles, delete users
- **Car Management** – View all cars, delete listings
- **Booking Management** – Update booking status and track transactions
- **Maintenance Mode** – Temporarily disable platform for non-admin users
- **Premium UI** – Royal white and standard professional design

---

## 🗄️ Database Models

- **User** – User profiles with role (student/owner/admin), authentication, profile image
- **Car** – Vehicle details, owner reference, pricing, availability status
- **Booking** – Booking records with user, car, dates, status, and pricing
- **Settings** – Platform settings (maintenance mode toggle)

---

## 📂 Folder Structure

```
Wheel-O-Rent/
├── client/        # Frontend (React.js + Tailwind CSS)
├── server/        # Backend (Node.js + Express.js + MongoDB)
└── README.md
```

---

## 🔮 Future Scope

* Online payment integration
* Digital license verification
* Mobile app (Android/iOS)
* IoT-based vehicle health tracking

---

### Developed by

Dhruv, Divyansh Jain, Akshat Awasthi, Parth Azad

