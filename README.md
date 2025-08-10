# Wheel-o-Rent

**Wheel-o-Rent** is a full-stack MERN application for short-term rentals of two- and four-wheelers. It offers real-time availability, simple booking, and role-based access control for students, admins, and vehicle owners. Designed for affordability and a seamless user experience.

🔗 **Live Demo:** [wheel-o-rent.vercel.app](https://wheel-o-rent.vercel.app)  

---

## 🚀 Features
- **Real-Time Availability** – Instantly view available vehicles.
- **Effortless Booking** – Quick and intuitive booking process.
- **Role-Based Access Control (RBAC):**
  - **Students:** Browse and book vehicles.
  - **Admins:** Manage users, approve listings, and monitor rentals.
  - **Vehicle Owners:** List and manage vehicles.
- **Responsive UI** – Optimized for mobile and desktop.
- **Modern Tech Stack** – MERN (MongoDB, Express.js, React.js, Node.js).

---

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
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

Create a `.env` file inside the `server` folder with the following:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
Create a `.env` file inside the `client` folder with the following:
```env
VITE_CURRENCY=your_currency_symbol
VITE_BASE_URL=your_base_url
```

### 4. Run the development servers

```bash
# Run backend server
cd server
npm start server

# Run frontend client
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) for frontend in your browser.

Open [http://localhost:3000](http://localhost:3000) for server in your browser.

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

