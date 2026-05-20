<p align="center">
  <img src="client/public/queueless-logo.png" alt="QueueLess Logo" width="360" />
</p>

<h1 align="center">QueueLess</h1>

<p align="center">
  A fullstack digital queue management platform that helps customers join queues online, track queue position, see estimated wait times, and helps businesses manage tickets more efficiently.
</p>

<p align="center">
  Built with React, Vite, Node.js, Express, MongoDB, Mongoose, JWT, and Render.
</p>

---

## Table of Contents

- [About QueueLess](#about-queueless)
- [Live Deployment](#live-deployment)
- [Team](#team)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)
- [Folder and File Explanation](#folder-and-file-explanation)
- [How the Application Works](#how-the-application-works)
- [Smart Estimated Wait Time](#smart-estimated-wait-time)
- [Authentication and Authorization](#authentication-and-authorization)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Creating an Admin Account](#creating-an-admin-account)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Responsive Design](#responsive-design)
- [Git and Development Process](#git-and-development-process)
- [Future Improvements](#future-improvements)
- [Authors](#authors)

---

## About QueueLess

QueueLess is a fullstack queue management application designed to make waiting lines easier, clearer, and more organized for both customers and businesses.

Instead of waiting in unclear physical lines, customers can create a digital ticket, follow their queue position, see estimated wait times, and receive notifications about their ticket.

Businesses can manage their queues in one place by starting tickets, completing tickets, cancelling no-shows, warning customers, blocking or unblocking customers, and reviewing ticket history.

The system also includes an admin dashboard where an admin can view system statistics, users, businesses, tickets, recent activity, and ticket status data. Admin users can also create, update, and delete customer and business accounts.

QueueLess supports role-based login for customers, businesses, and admins, so each user gets access to the correct dashboard and tools.

---

## Live Deployment

The project is deployed using Render.

- **Backend API:** `https://queueless-6al7.onrender.com`
- **Frontend:** `https://queueless-frontend-h5xq.onrender.com/`

---

## Team

**Team name:** QueueLess Team

**Team members:**

- Mohammed Kawaf
- Daniel Owliazadehabbasi
- Mahmoud Nour

---

## Features

### Customer Features

- Register and log in as a customer.
- Search for businesses.
- Show or hide the business list for easier navigation.
- Create digital tickets.
- Preview estimated wait time before creating a ticket.
- See queue position.
- See estimated wait time.
- Edit waiting tickets.
- Cancel waiting tickets.
- Filter current tickets by business.
- View ticket history.
- Filter history by status.
- Receive inbox notifications.
- Mark notifications as read automatically.
- Change account password.
- Show or hide password while changing password.
- Delete account.

### Business Features

- Register and log in as a business.
- View current queue.
- View active customer.
- Start waiting tickets.
- Complete active tickets.
- Cancel waiting tickets.
- Cancel no-show tickets after a waiting period.
- Warn customers.
- Block customers.
- Block all waiting and active tickets from the same customer at the same business.
- Unblock customers.
- View ticket history.
- Filter history by status.
- Change account password.
- Show or hide password while changing password.
- Delete account.

### Admin Features

- Admin-only dashboard.
- View system statistics.
- View all users.
- View all businesses.
- View all tickets.
- Filter tickets by status.
- Search users.
- Search businesses.
- View recent activity.
- View ticket status visualization.
- Create customer accounts.
- Create business accounts.
- Send welcome notifications when accounts are created.
- Update customer account information.
- Update business account information.
- Update business names and categories.
- Delete customer accounts.
- Delete business accounts.
- Protected admin routes with admin-role verification.

---

## Technologies Used

### Frontend

- React
- JavaScript
- CSS
- Vite

### Backend

- Node.js
- Express.js
- JWT authentication
- bcrypt

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment

- Render

### Development Tools

- Git
- GitHub
- Postman
- VS Code

---

## Dependencies

### Root Dependencies

The root project is used to run the client and server together during development.

- `concurrently`  
  Used to run the frontend and backend at the same time with one command.

### Frontend Dependencies

The frontend is located inside the `client` folder.

- `@vitejs/plugin-react`  
  React plugin for Vite.

- `vite`  
  Frontend build tool and development server.

- `react`  
  JavaScript library for building the user interface.

- `react-dom`  
  Used to render React components in the browser.

- `eslint`  
  Used for linting and code quality.

- `@eslint/js`  
  ESLint JavaScript configuration support.

- `eslint-plugin-react-hooks`  
  ESLint rules for React hooks.

- `eslint-plugin-react-refresh`  
  ESLint support for React Fast Refresh.

- `globals`  
  Provides global variable definitions for linting.

### Backend Dependencies

The backend is located inside the `server` folder.

- `express`  
  Backend framework used to build the REST API.

- `mongoose`  
  Used to create schemas, models, and communicate with MongoDB.

- `mongodb`  
  MongoDB driver used by the backend.

- `dotenv`  
  Loads environment variables for local development.

- `@dotenvx/dotenvx`  
  Used for environment variable loading in development.

- `cors`  
  Allows the frontend to communicate with the backend.

- `jsonwebtoken`  
  Used to create and verify JWT authentication tokens.

- `bcrypt`  
  Used to hash and compare passwords securely.

- `mysql2`  
  Earlier database dependency from the first version of the project.

---

## Project Structure

```txt
QueueLess/
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── eslint.config.js
├── index.html
├── vite.config.js
├── client/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── public/
│   │   ├── favicon.svg
│   │   └── queueless-logo.png
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── pages/
│       │   ├── login.jsx
│       │   ├── Register.jsx
│       │   ├── Customer.jsx
│       │   ├── Business.jsx
│       │   ├── Admin.jsx
│       │   ├── Account.jsx
│       │   ├── Inbox.jsx
│       │   └── History.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           ├── index.css
│           ├── auth.css
│           ├── dashboard.css
│           ├── buttons.css
│           ├── form.css
│           ├── badges.css
│           └── admin.css
└── server/
    ├── package.json
    ├── package-lock.json
    ├── server.js
    ├── config/
    │   └── mongo.js
    ├── controllers/
    │   ├── authController.js
    │   ├── ticketController.js
    │   ├── businessController.js
    │   ├── notificationController.js
    │   ├── businessActionController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── adminMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Business.js
    │   ├── ticket.js
    │   ├── ticketModel.js
    │   ├── userModel.js
    │   ├── businessModel.js
    │   ├── Notification.js
    │   ├── BusinessBlock.js
    │   └── BusinessWarning.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── ticketRoutes.js
    │   ├── businessRoutes.js
    │   ├── notificationRoutes.js
    │   ├── businessActionRoutes.js
    │   └── adminRoutes.js
    └── scripts/
        └── createAdmin.js
```

---

## Folder and File Explanation

### Root Folder

- `README.md`  
  Project documentation.

- `package.json`  
  Root package file used to run both frontend and backend together during development.

- `package-lock.json`  
  Stores exact dependency versions for the root project.

- `.gitignore`  
  Specifies files and folders that should not be pushed to GitHub, such as `node_modules` and environment files.

- `eslint.config.js`  
  ESLint configuration.

- `index.html`  
  HTML entry file.

- `vite.config.js`  
  Vite configuration file.

---

### Client Folder

- `client/`  
  Frontend React application.

- `client/public/`  
  Public frontend assets.

- `client/public/favicon.svg`  
  QueueLess favicon used in the browser tab and navbar.

- `client/public/queueless-logo.png`  
  QueueLess logo used on the login and register pages.

- `client/src/`  
  Main frontend source folder.

- `client/src/App.jsx`  
  Main React component. Handles navigation between pages, role-based views, footer, and About modal.

- `client/src/main.jsx`  
  React entry point. Imports global CSS files and renders the app.

---

### Client Pages

- `client/src/pages/login.jsx`  
  Login page for customers, businesses, and admins.

- `client/src/pages/Register.jsx`  
  Register page for customers and businesses.

- `client/src/pages/Customer.jsx`  
  Customer dashboard. Handles business search, show/hide businesses, ticket creation, estimated wait preview, current tickets, ticket editing, ticket cancelling, and ticket filtering.

- `client/src/pages/Business.jsx`  
  Business dashboard. Handles current queue, active customer, starting tickets, completing tickets, cancelling tickets, warning customers, blocking customers, and unblocking customers.

- `client/src/pages/Admin.jsx`  
  Admin dashboard. Shows system statistics, users, businesses, tickets, recent activity, search, filters, ticket status visualization, and admin CRUD operations.

- `client/src/pages/Account.jsx`  
  Account page. Shows user information, logout confirmation, password changing, show/hide password, and account deletion.

- `client/src/pages/Inbox.jsx`  
  Inbox page. Shows notifications and marks them as read when opened.

- `client/src/pages/History.jsx`  
  Ticket history page for customers and businesses. Supports filtering by ticket status.

---

### Client Services

- `client/src/services/api.js`  
  Contains frontend API requests to the backend. It supports a deployed backend API URL and falls back to local development when needed.

---

### Client Styles

- `client/src/styles/index.css`  
  Global CSS variables, base styles, typography, and page background.

- `client/src/styles/auth.css`  
  Styling for login and register pages.

- `client/src/styles/dashboard.css`  
  Shared dashboard styles, navbar, footer, modals, cards, layout, About modal, and responsive layout.

- `client/src/styles/buttons.css`  
  Shared button styles.

- `client/src/styles/form.css`  
  Shared form styles.

- `client/src/styles/badges.css`  
  Status badge styles for waiting, active, done, cancelled, and blocked tickets.

- `client/src/styles/admin.css`  
  Admin dashboard styles, statistics cards, admin tables, search inputs, recent activity, and ticket status visualization.

---

### Server Folder

- `server/`  
  Backend Express application.

- `server/server.js`  
  Main backend server file. Connects middleware, routes, MongoDB, and starts the server.

---

### Server Config

- `server/config/mongo.js`  
  MongoDB connection setup.

---

### Server Controllers

- `server/controllers/authController.js`  
  Handles register, login, get current user, account deletion, and password changing.

- `server/controllers/ticketController.js`  
  Handles ticket creation, ticket editing, ticket cancelling, starting tickets, completing tickets, fetching tickets, and estimated wait preview.

- `server/controllers/businessController.js`  
  Handles fetching businesses.

- `server/controllers/notificationController.js`  
  Handles notifications, unread count, and marking notifications as read.

- `server/controllers/businessActionController.js`  
  Handles business actions such as warning, blocking, and unblocking customers.

- `server/controllers/adminController.js`  
  Handles admin statistics, users, businesses, tickets, and admin CRUD operations.

---

### Server Middleware

- `server/middleware/authMiddleware.js`  
  Verifies JWT tokens and protects authenticated routes.

- `server/middleware/adminMiddleware.js`  
  Verifies that the logged-in user has the admin role.

---

### Server Models

- `server/models/User.js`  
  User model. Supports customer, business, and admin roles.

- `server/models/Business.js`  
  Business model. Stores business name and category.

- `server/models/ticket.js`  
  Ticket model. Stores ticket user, business, message, status, queue data, and cancellation/blocking information.

- `server/models/ticketModel.js`  
  Helper model file for ticket-related database logic such as creating tickets, fetching tickets, starting tickets, completing tickets, cancelling tickets, editing tickets, and calculating estimated wait time.

- `server/models/userModel.js`  
  Helper model file for user-related logic.

- `server/models/businessModel.js`  
  Helper model file for business-related logic.

- `server/models/Notification.js`  
  Notification model. Stores user notifications.

- `server/models/BusinessBlock.js`  
  Stores blocked customers for specific businesses.

- `server/models/BusinessWarning.js`  
  Stores warnings given by businesses to customers.

---

### Server Routes

- `server/routes/authRoutes.js`  
  Auth routes for register, login, current user, password changing, and account deletion.

- `server/routes/ticketRoutes.js`  
  Ticket routes for customer and business ticket actions, including estimated wait preview.

- `server/routes/businessRoutes.js`  
  Business routes.

- `server/routes/notificationRoutes.js`  
  Notification routes.

- `server/routes/businessActionRoutes.js`  
  Routes for warning, blocking, and unblocking customers.

- `server/routes/adminRoutes.js`  
  Protected admin routes for statistics, users, businesses, tickets, and admin CRUD operations.

---

### Server Scripts

- `server/scripts/createAdmin.js`  
  Script used by developers to create or update an admin account safely.

---

## How the Application Works

QueueLess has three main user roles:

### Customer

A customer can log in, search for a business, create a ticket, and follow their queue position. The customer can also see estimated wait time, edit waiting tickets, cancel waiting tickets, view history, receive notifications, and manage account settings.

### Business

A business can manage tickets created for their business. They can start a ticket, mark it as done, cancel it, warn a customer, block a customer, or unblock a customer.

When a business blocks a customer, all waiting and active tickets from that customer for the same business are moved to blocked status.

### Admin

An admin can view an overview of the whole system. The admin dashboard shows statistics, users, businesses, tickets, recent activity, and ticket status data.

The admin can also create, update, and delete customer and business accounts.

---

## Smart Estimated Wait Time

QueueLess calculates estimated wait time per business.

The system uses completed tickets to calculate an average service time for each business. The service time is calculated from when a ticket is started to when it is completed.

Example:

- If a business usually completes tickets in 15 minutes, position 1 is estimated at 15 minutes.
- Position 2 is estimated at 30 minutes.
- Position 3 is estimated at 45 minutes.

If a business does not have completed tickets yet, the system uses a fallback estimated time (5 min).

The create ticket modal also uses a backend estimated wait endpoint, so the preview matches the estimated wait shown after the ticket is created.

---

## Data Flow

1. The user interacts with the React frontend.
2. The frontend sends API requests to the Express backend.
3. Protected requests include a JWT token in the request headers.
4. The backend verifies the token and checks the user role.
5. The backend reads or updates data in MongoDB using Mongoose.
6. The backend sends a JSON response back to the frontend.
7. The frontend updates the UI based on the response.

---

## Authentication and Authorization

QueueLess uses JWT authentication.

When a user logs in, the backend returns a token. The frontend stores the token in `localStorage` and sends it with protected requests.

Protected routes are used for:

- Tickets
- Notifications
- Business actions
- Account information
- Admin dashboard

Admin routes are protected with both token verification and admin-role verification.

Passwords are hashed with bcrypt before being stored in the database.

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QueueLess
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Running the Project Locally

From the root folder, run:

```bash
npm run dev
```

This starts both the backend and frontend.

Backend runs on:

```txt
http://localhost:3030
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Creating an Admin Account

Admin accounts are not created from the public register page.

To create or update an admin account, use the admin script.

From the `server` folder:

```bash
node scripts/createAdmin.js
```

The admin script is used so that normal users cannot create admin accounts through the public registration page.

---

## Deployment

The backend and frontend are deployed on Render.

### Backend Deployment

Backend Render settings:

- **Service type:** Web Service
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

Backend URL:

```txt
https://queueless-6al7.onrender.com
```

### Frontend Deployment

Frontend Render settings:

- **Service type:** Static Site
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

Frontend URL:

```txt
https://queueless-frontend-h5xq.onrender.com/
```

---

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/change-password`
- `DELETE /auth/me`

### Tickets

- `GET /tickets/my`
- `GET /tickets/business`
- `GET /tickets/estimated-wait/:businessId`
- `POST /tickets`
- `PUT /tickets/start/:id`
- `PUT /tickets/done/:id`
- `PUT /tickets/cancel/:id`
- `PUT /tickets/edit/:id`

### Businesses

- `GET /businesses`

### Notifications

- `GET /notifications/my`
- `GET /notifications/unread-count`
- `PUT /notifications/read/:id`

### Business Actions

- `POST /business-actions/warn`
- `POST /business-actions/block`
- `POST /business-actions/unblock`

### Admin

- `GET /admin/stats`
- `GET /admin/users`
- `POST /admin/users`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`
- `GET /admin/businesses`
- `PUT /admin/businesses/:id`
- `DELETE /admin/businesses/:id`
- `GET /admin/tickets`
- `GET /admin/tickets?status=waiting`

---

## Testing

The project was tested with Postman and through the browser.

### Customer Tests

- Register customer.
- Login customer.
- Create ticket.
- View estimated wait preview.
- View queue position.
- Edit ticket.
- Cancel ticket.
- Filter current tickets.
- View history.
- View inbox notifications.
- Change password.
- Delete account.

### Business Tests

- Register business.
- Login business.
- Start ticket.
- Complete ticket.
- Cancel ticket.
- Warn customer.
- Block customer.
- Unblock customer.
- View history.
- Check that blocked customers cannot create new tickets.
- Check that all waiting and active tickets are blocked when a customer is blocked.
- Change password.

### Admin Tests

- Login admin.
- Get system statistics.
- Get all users.
- Get all businesses.
- Get all tickets.
- Filter tickets by status.
- Create customer account.
- Create business account.
- Update account information.
- Update business information.
- Delete test customer account.
- Delete test business account.
- Block non-admin users from admin routes.

### Deployment Tests

- Test backend root route.
- Test login through deployed backend.
- Test frontend login through deployed frontend.
- Test customer, business, and admin flows on the live site.

---

## Responsive Design

QueueLess is designed to work on different screen sizes:

- Desktop
- Tablet
- Mobile

The layout, cards, navigation, modals, forms, and admin dashboard are styled to adapt to smaller screens.

We also added a show/hide business list button to make the customer dashboard easier to use on mobile.

---

## Git and Development Process

The project was developed using Git and GitHub.

The team worked with regular commits throughout the development process. Features were added step by step, including:

- Authentication
- Customer dashboard
- Business dashboard
- Ticket system
- Notifications
- History filters
- Block and warning system
- Account management
- Change password
- Smart estimated wait time
- About modal
- Footer
- Admin dashboard
- Admin statistics
- Admin search and filters
- Admin CRUD operations
- Deployment setup

---

## Future Improvements

Possible future improvements include:

- More advanced admin analytics.
- Email notifications.
- Real-time updates with WebSockets.
- More accessibility improvements.
- More detailed business statistics.
- Better notification categories.
- More advanced account management.
- Better mobile navigation.
- Appointment booking functionality.

---

## Authors

QueueLess was built by:

- Mohammed Kawaf
- Daniel Owliazadehabbasi
- Mahmoud Nour