 Restaurant Management System – Backend API

Project: Restaurant Order and Booking Management System  
Developer: Suvam Khanal  
Student ID: 23048958  
Role: Associate Full Stack Developer  
Company: Growfore Solutions, Pokhara  
Supervisor: Tej Bahadur Kshetri  

What is this?

This is the backend API for a Restaurant Order and Booking Management System. It handles all the server-side logic for the restaurant website including admin authentication, menu management, banner management, table bookings, and site settings. It is built using Node.js, Express.js, and TypeScript, with PostgreSQL as the database.



 Technology Stack

| Tool | Purpose |
|------|---------|
| Node.js | Server runtime |
| Express.js | Web framework for building API routes |
| TypeScript | Typed JavaScript for cleaner, safer code |
| PostgreSQL | Database |
| Prisma | ORM to interact with the database |
| Multer | Handles file/image uploads |
| JWT | User authentication (login tokens) |



Folder Structure

```
backend/
│
├── src/
│   ├── routes/
│   │   ├── adminRoute.ts          # Admin login, register, update, delete
│   │   ├── bannerRoute.ts         # Banner CRUD + image upload
│   │   ├── categoryRoute.ts       # Menu category CRUD
│   │   ├── featureCategoryRoute.ts # Feature category CRUD
│   │   ├── legalRoute.ts          # Legal pages CRUD
│   │   ├── menuItemRoute.ts       # Menu item CRUD
│   │   └── siteRoute.ts           # Site settings
│   │
│   ├── controller/
│   │   ├── admin/                 # Admin login, register, update, delete logic
│   │   ├── banner/                # Banner create, get, update, delete logic
│   │   ├── menuCategory/          # Menu category logic
│   │   ├── featureCategory/       # Feature category logic
│   │   ├── legal/                 # Legal pages logic
│   │   ├── menuItem/              # Menu item logic
│   │   └── site/                  # Site settings logic
│   │
│   ├── middleware/                # Auth checks and error handling
│   ├── prisma/                    # Database schema and client
│   └── server.ts                  # Main entry point
│
├── .env                           # Environment variables (not shared)
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies
└── README.md                      # This file
```

---

## API Routes

### Admin Routes – `/api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /login | Admin login – returns JWT token |
| POST | /register | Register a new admin account |
| PUT | /updateAdmin/:id | Update admin details by ID |
| DELETE | /deleteAdmin/:id | Delete an admin account by ID |

---

### Banner Routes – `/api/banner`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all banners |
| POST | / | Create a new banner (with image upload) |
| PATCH | /:id | Update a banner by ID |
| DELETE | /:id | Delete a banner by ID |

> Image upload is handled using **Multer** middleware.

---

### Menu Category Routes – `/api/category`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all menu categories |
| POST | / | Create a new category |
| PATCH | /:id | Update a category by ID |
| DELETE | /:id | Delete a category by ID |

---

### Feature Category Routes – `/api/feature-category`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all feature categories |
| GET | /:id | Get a single feature category by ID |
| POST | / | Create a new feature category |
| PATCH | /:id | Update a feature category by ID |
| DELETE | /:id | Delete a feature category by ID |


Legal Routes – `/api/legal`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all legal pages |
| GET | /:id | Get a single legal page by ID |
| POST | / | Create a new legal page |
| PATCH | /:id | Update a legal page by ID |
| DELETE | /:id | Delete a legal page by ID |



Menu Item Routes – `/api/menu-item`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all menu items |
| GET | /category/:categoryId | Get menu items by category |
| GET | /:id | Get a single menu item by ID |
| POST | / | Create a new menu item |
| PATCH | /:id | Update a menu item by ID |
| DELETE | /:id | Delete a menu item by ID |



Site Settings Routes – `/api/site`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get site settings |
| POST | / | Update site settings |

---

## How to Run the Project

### Step 1 – Clone the repository
```
git clone https://github.com/your-repo-name.git
cd backend
```

### Step 2 – Install dependencies
```
npm install
```

### Step 3 – Set up environment variables
Create a `.env` file in the root folder and add:
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_db
JWT_SECRET=your_secret_key
```

### Step 4 – Set up the database
```
npx prisma migrate dev
npx prisma generate
```

### Step 5 – Run the development server
```
npm run dev
```

The server will start at `http://localhost:5000`

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for admin authentication.

- Admin logs in via `POST /api/admin/login`
- A token is returned on successful login
- This token must be included in the `Authorization` header for protected routes:
```
Authorization: Bearer your_token_here
```

---

## What I Worked On

As part of my internship, I built and completed the following:

- Set up the full Express + TypeScript project structure
- Built all admin CRUD routes and controllers
- Built banner management with image upload using Multer
- Built menu category, feature category, and menu item routes
- Built legal pages management routes
- Built site settings routes
- Used TypeScript throughout for type safety and cleaner code

---

## Known Issues / To Do

- [ ] Add authentication middleware to protect admin routes
- [ ] Add input validation using Zod or Joi
- [ ] Add unit tests for controllers
- [ ] Complete order management routes
- [ ] Complete table booking routes
- [ ] Add role-based access control

---

## Author

**Suvam Khanal**  
Student ID: 23048958  
London Metropolitan University  
Internship at Growfore Solutions, Pokhara, Nepal  
Email: suvam.khanal.a23@icp.edu.np  
Mobile: 9806728061  

---

*This backend was developed as part of the Restaurant Order and Booking Management System project during an internship placement at Growfore Solutions.*
