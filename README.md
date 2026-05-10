# 🏔 Tourista GB — Full-Stack Tourism Web Application

> A complete MERN-stack tourism platform for Gilgit-Baltistan, Pakistan.
> Final Year Project — BS Computer Science, University of Agriculture, Peshawar (2022–2026)
> Team: Kashif Qamar (576), Muhammad Muneeb (100), Mueed Hassan (570)
> Supervisor: Ms. Lala Rukh

---

## 📁 Project Structure

```
tourista/
├── backend/               ← Node.js + Express API
│   ├── config/
│   │   ├── db.js          ← MongoDB connection
│   │   ├── cloudinary.js  ← Image upload config
│   │   └── seed.js        ← Sample data seeder
│   ├── controllers/       ← Route handlers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── placeController.js
│   │   ├── experienceController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js        ← JWT protect & role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Place.js
│   │   ├── Experience.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── places.js
│   │   ├── experiences.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── server.js          ← Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/              ← React.js SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.js + .css
    │   │       ├── Footer.js + .css
    │   │       ├── PropertyCard.js + .css
    │   │       ├── PlaceCard.js + .css
    │   │       ├── ExperienceCard.js + .css
    │   │       ├── MapView.js       ← Leaflet map
    │   │       ├── StarRating.js
    │   │       └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js       ← Global auth state
    │   ├── pages/
    │   │   ├── Home.js + .css       ← Landing page
    │   │   ├── Stays.js + .css      ← Property listings
    │   │   ├── PropertyDetail.js + .css
    │   │   ├── Places.js            ← Destinations
    │   │   ├── PlaceDetail.js
    │   │   ├── Experiences.js       ← Activities
    │   │   ├── ExperienceDetail.js
    │   │   ├── Login.js + Auth.css  ← Auth pages
    │   │   ├── Register.js
    │   │   ├── Dashboard.js         ← User dashboard
    │   │   ├── MyBookings.js        ← Booking history
    │   │   ├── Wishlist.js
    │   │   ├── HostPanel.js + .css  ← Host management
    │   │   ├── AdminPanel.js + .css ← Admin control
    │   │   ├── BecomeHost.js + .css
    │   │   ├── About.js + .css
    │   │   ├── Contact.js + .css
    │   │   └── NotFound.js
    │   ├── services/
    │   │   └── api.js               ← Axios API layer
    │   ├── App.js                   ← Router + layout
    │   ├── index.js
    │   └── index.css                ← Design system
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ (https://nodejs.org)
- MongoDB v6+ (local) or MongoDB Atlas (cloud)
- Git

---

### Step 1 — Clone / Download the Project

```bash
# If using git:
git clone <your-repo-url>
cd tourista

# Or just navigate to the tourista/ folder
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tourista
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRE=30d

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

**Using MongoDB Atlas (recommended):**
1. Create free account at https://mongodb.com/atlas
2. Create a cluster → Get connection string
3. Replace MONGO_URI with: `mongodb+srv://username:password@cluster.mongodb.net/tourista`

---

### Step 3 — Seed the Database

```bash
# From backend/ folder:
npm run seed
```

This creates sample data:
- 4 users (admin, 2 hosts, 1 user)
- 7 places (Hunza, Skardu, Fairy Meadows, etc.)
- 5 properties (hotels, guesthouses, cabins)
- 5 experiences (trekking, jeep safari, cultural tours)

**Login credentials after seeding:**
| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@tourista.pk    | admin123 |
| Host  | karim@host.pk        | host123  |
| Host  | fatima@host.pk       | host123  |
| User  | ali@user.pk          | user123  |

---

### Step 4 — Start Backend

```bash
# From backend/ folder:
npm run dev     # Development (with nodemon auto-reload)
# OR
npm start       # Production
```

Backend runs at: **http://localhost:5000**
Health check: **http://localhost:5000/api/health**

---

### Step 5 — Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

`.env` for frontend:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Tourista
```

---

### Step 6 — Start Frontend

```bash
# From frontend/ folder:
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔌 API Reference

### Auth Endpoints
| Method | Endpoint                      | Auth     | Description          |
|--------|-------------------------------|----------|----------------------|
| POST   | /api/auth/register            | Public   | Register user/host   |
| POST   | /api/auth/login               | Public   | Login                |
| GET    | /api/auth/me                  | Required | Get current user     |
| PUT    | /api/auth/profile             | Required | Update profile       |
| PUT    | /api/auth/change-password     | Required | Change password      |
| POST   | /api/auth/wishlist/:id        | Required | Toggle wishlist      |

### Properties
| Method | Endpoint                        | Auth       | Description        |
|--------|---------------------------------|------------|--------------------|
| GET    | /api/properties                 | Public     | List (with filters)|
| GET    | /api/properties/:id             | Public     | Get single         |
| POST   | /api/properties                 | Host/Admin | Create             |
| PUT    | /api/properties/:id             | Host/Admin | Update             |
| DELETE | /api/properties/:id             | Host/Admin | Delete             |
| PATCH  | /api/properties/:id/approve     | Admin      | Approve/reject     |
| GET    | /api/properties/host/my         | Host       | Get own listings   |
| GET    | /api/properties/map             | Public     | Map pins data      |

### Places, Experiences, Bookings, Reviews
Follow same pattern — see routes/ folder for full reference.

### Admin Endpoints (admin role only)
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/admin/dashboard  | Stats & analytics     |
| GET    | /api/admin/users      | All users             |
| PATCH  | /api/admin/users/:id  | Update user role/status |
| GET    | /api/admin/pending    | All pending items     |
| GET    | /api/admin/bookings   | All bookings          |

---

## 🎨 Features Implemented

### 🌐 Frontend
- ✅ Responsive Navbar with dropdowns (Stays, Experiences sub-menus)
- ✅ Hero section with full-screen image & search panel
- ✅ Explore by Region grid (6 regions)
- ✅ Interactive Leaflet map (stays + places + experiences pins)
- ✅ Property listings with filters (region, type, price, amenities)
- ✅ Property detail page with image gallery, booking card, reviews
- ✅ Places to Visit with map toggle
- ✅ Place detail with tips, activities, info sidebar
- ✅ Experiences listing with type/region filters
- ✅ Experience detail with booking form
- ✅ Login / Register with role selector (User vs Host)
- ✅ User Dashboard with profile editing
- ✅ My Bookings with cancellation
- ✅ Wishlist (save/unsave properties)
- ✅ Host Panel (add/edit/delete properties & experiences, view bookings)
- ✅ Admin Panel (dashboard stats, approve/reject, user management, booking table)
- ✅ Become a Host landing page
- ✅ About page with team info
- ✅ Contact page with emergency contacts
- ✅ 404 Not Found page
- ✅ Toast notifications throughout

### ⚙️ Backend
- ✅ JWT authentication with bcrypt password hashing
- ✅ Role-based access control (user / host / admin)
- ✅ Full CRUD for Properties, Places, Experiences
- ✅ Booking system with check-in/check-out & price calculation
- ✅ Review system with auto-rating aggregation
- ✅ Admin approval workflow
- ✅ Rate limiting & security headers
- ✅ MongoDB with indexes for performance
- ✅ Database seeder with real GB data

---

## 🗺️ Map Usage

The project uses **Leaflet.js** (open-source, no API key needed):
- Blue dots = Properties/Stays
- Orange dots = Places to Visit
- Green dots = Experiences

If you want Google Maps instead, replace `react-leaflet` with `@react-google-maps/api` and add your Maps API key to `.env`.

---

## 🔧 Common Issues & Fixes

**MongoDB connection error:**
- Make sure MongoDB is running: `sudo systemctl start mongod` (Linux) or open MongoDB Compass
- Check MONGO_URI in .env

**CORS error:**
- Make sure FRONTEND_URL in backend .env matches your React dev URL (http://localhost:3000)

**npm install fails:**
- Delete `node_modules/` and `package-lock.json`, then run `npm install` again

**Port already in use:**
- Change PORT in backend .env or kill the process using that port

---

## 📈 Future Enhancements (FYP-II)

- [ ] Real image upload via Cloudinary
- [ ] Payment gateway (JazzCash / Easypaisa)
- [ ] Email notifications (booking confirmation)
- [ ] Multi-language support (English + Urdu)
- [ ] Weather widget (OpenWeatherMap API)
- [ ] Blog system for travel articles
- [ ] Advanced analytics for admin
- [ ] Mobile app (React Native)
- [ ] Real-time chat (Socket.io)

---

## 👥 Team

| Name             | Student ID | Role              |
|------------------|------------|-------------------|
| Kashif Qamar     | 576        | Backend Lead      |
| Muhammad Muneeb  | 100        | Integration & Maps |
| Mueed Hassan     | 570        | Frontend Lead     |

**Supervisor:** Ms. Lala Rukh
**Institution:** University of Agriculture, Peshawar
**Session:** 2022–2026

---

*🇵🇰 Built with ❤️ for promoting tourism in Gilgit-Baltistan, Pakistan*
