
# 🏠 RentEasy

<div align="center">  
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">  
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">  
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">  
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">  
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white">  
</div>  

<p align="center">  
  🚀 <b>Modern Rental Management Platform</b> - A full-stack solution for property owners, tenants, and businesses  
  <br>  
  <i>🎓 College Project | MERN + Stripe + Cloudinary + Google Maps</i>  
</p>  

---

## ✨ Features

### 🏡 Property Owners

* List and manage properties with photos & pricing
* Review tenant applications and manage bookings
* Revenue analytics & direct tenant messaging

### 👥 Tenants

* Advanced property search with filters & maps
* Instant booking with secure online payments
* Favorites, reviews, and rental history management

### 🔧 Admin

* User and listing management
* Transaction & payout monitoring
* Analytics dashboard & security monitoring

---

## 🛠 Tech Stack

**Frontend:** React.js, Redux/Context API, React Router, Tailwind/Material-UI, Axios, Leaflet/Google Maps
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, Nodemailer
**Payments & Services:** Stripe, Cloudinary, SendGrid, Firebase, Google APIs
**DevOps:** Docker, Heroku/Vercel, ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites

* Node.js v16+
* MongoDB (local/Atlas)
* Stripe & Google Maps API keys

### Installation

```bash
# Clone repo
git clone https://github.com/saurabhKrOO7/RentEasy.git
cd RentEasy

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Run the App

```bash
# Run frontend + backend
npm run dev
```

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend API → [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Structure

```
RentEasy/
├── client/         # React frontend
├── server/         # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── uploads/        # File uploads
├── .env.example
├── package.json
└── README.md
```

---

## 🎯 API Overview

* **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
* **Properties**: `GET /api/properties`, `POST /api/properties`
* **Bookings**: `GET /api/bookings`, `POST /api/bookings`
* **Reviews**: `POST /api/reviews`

📖 Full API docs → `http://localhost:5000/api-docs`

---

## 🌐 Live Demo

🔗 [View Demo](https://renteasy-frontend.onrender.com/)

**Demo Accounts:**

* seller → `seller@gmail.com` / `seller`
* User → `buyer@gmail.com` / `buyer`
* Admin → `saurabh@gmail.com` / `saurabh`

---

## 🤝 Contributing

1. Fork repo & create branch → `git checkout -b feature/awesome`
2. Commit changes → `git commit -m "feat: add awesome feature"`
3. Push branch → `git push origin feature/awesome`
4. Open a Pull Request 🚀


---

<div align="center">  
  ⭐ If you find this project useful, don’t forget to star it!  
  <br>Made with ❤️ by <b>Saurabh Kumar</b>  
</div>  

---

