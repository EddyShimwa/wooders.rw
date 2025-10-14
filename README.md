# Wooders - Next.js E-commerce Platform 🌲# Wooders - Wood Furniture E-Commerce Platform



A modern, full-stack e-commerce platform for handcrafted wooden furniture and décor, built with Next.js 15, MongoDB, and TypeScript.A full-stack e-commerce application for custom wood furniture with order tracking and management.



![Next.js](https://img.shields.io/badge/Next.js-15.5-black)## Project Structure

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)This project consists of two main parts:

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)- **Frontend** (React + Vite + TypeScript)

- **Backend** (Express.js + MongoDB)

## 🚀 Features

## Features

### Customer Features

- 🛍️ **Product Browsing** - Beautiful carousel showcase of handcrafted items### Client Features

- ❤️ **Wishlist** - Save favorite products for later- Browse wood furniture products

- 🛒 **Easy Ordering** - Simple checkout process- Place orders with custom details

- 📦 **Order Tracking** - Track orders with unique order numbers- Track orders using order numbers

- 🌙 **Dark Mode** - Toggle between light and dark themes- Wishlist functionality

- 📱 **Responsive Design** - Perfect experience on all devices- Dark/Light theme toggle



### Admin Features### Admin Features

- 📊 **Order Management** - View and manage all customer orders- View all orders

- ✅ **Status Updates** - Update order status (pending → processing → shipped → delivered)- Update order status (pending → processing → shipped → delivered)

- 🗑️ **Order Deletion** - Remove orders when needed- Delete orders

- 📈 **Real-time Updates** - Live order data from MongoDB- Real-time order management dashboard



### Technical Features## Getting Started

- ⚡ **Server-Side Rendering** - Fast initial page loads with Next.js

- 🔌 **API Routes** - Built-in Next.js API routes (no separate backend needed!)### Prerequisites

- 💾 **MongoDB Integration** - Persistent data storage

- 🎨 **shadcn/ui** - Beautiful, accessible UI components- Node.js (v16 or higher)

- 🎭 **Framer Motion** - Smooth animations and transitions- MongoDB (local installation or MongoDB Atlas account)

- 📝 **TypeScript** - Full type safety- npm or bun package manager

- 🔍 **React Query** - Efficient data fetching and caching

### Backend Setup

## 🚀 Getting Started

1. Navigate to the server directory:

### Prerequisites```sh

- Node.js 18+ cd server

- MongoDB (local or Atlas)```

- npm or yarn

2. Install dependencies:

### Installation```sh

npm install

1. **Clone the repository**```

   ```bash

   git clone <your-repo-url>3. Create a `.env` file:

   cd wooders-app```sh

   ```cp .env.example .env

```

2. **Install dependencies**

   ```bash4. Update the `.env` file with your MongoDB connection:

   npm install```

   ```PORT=5000

MONGODB_URI=mongodb://localhost:27017/wooders

3. **Set up environment variables**NODE_ENV=development

   ```bash```

   cp .env.example .env

   ```5. Start the backend server:

   ```sh

   Edit `.env` and add your MongoDB connection string:npm run dev

   ```env```

   MONGODB_URI=mongodb://localhost:27017/wooders

   # Or for MongoDB Atlas:The server will run on `http://localhost:5000`

   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wooders

   ```### Frontend Setup



4. **Start MongoDB** (if running locally)1. Navigate to the root directory and install dependencies:

   ```bash```sh

   mongodnpm install

   ``````



5. **Run the development server**2. Create a `.env` file in the root:

   ```bash```

   npm run devVITE_API_URL=http://localhost:5000/api

   ``````



6. **Open your browser**3. Start the development server:

   - Visit: http://localhost:3000```sh

   - Admin Panel: http://localhost:3000/admin/ordersnpm run dev

```

## 📝 API Endpoints

The frontend will run on `http://localhost:8080` (or another available port)

### Orders

## Running Both Servers

| Method | Endpoint | Description |

|--------|----------|-------------|You'll need two terminal windows:

| GET | `/api/orders` | Get all orders (Admin) |

| POST | `/api/orders` | Create new order |**Terminal 1 (Backend):**

| GET | `/api/orders/track/[orderNumber]` | Track order by number |```sh

| PATCH | `/api/orders/[id]/status` | Update order status (Admin) |cd server

| DELETE | `/api/orders/[id]` | Delete order (Admin) |npm run dev

```

## 🛠️ Tech Stack

**Terminal 2 (Frontend):**

- **Next.js 15** - React framework with App Router```sh

- **React 19** - UI librarynpm run dev

- **TypeScript** - Type safety```

- **MongoDB + Mongoose** - Database

- **Tailwind CSS** - Styling## API Endpoints

- **shadcn/ui** - Component library

- **Framer Motion** - Animations### Client Endpoints

- **React Query** - Data fetching- `POST /api/orders` - Create a new order

- `GET /api/orders/track/:orderNumber` - Track order by order number

## 📦 Deployment

### Admin Endpoints

### Vercel (Recommended)- `GET /api/orders` - Get all orders

- `PATCH /api/orders/:id/status` - Update order status

1. Push code to GitHub- `DELETE /api/orders/:id` - Delete order

2. Import project in [Vercel](https://vercel.com)

3. Add `MONGODB_URI` environment variable## Routes

4. Deploy!

- `/` - Home page with product listings

## 📄 License- `/about` - About page

- `/admin/orders` - Admin order management dashboard

MIT License

## Technologies Used

---

### Frontend

Made with ❤️ and 🌲- React 18

- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui components
- React Router
- Framer Motion

### Backend
- Express.js
- MongoDB with Mongoose
- TypeScript
- CORS
- dotenv

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/wooders`

### Option 2: MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

## Development

### Project Info
**URL**: https://lovable.dev/projects/8a8433b0-ab60-426a-9ab7-fc1eea41cec2

### Making Changes
- Use Lovable for quick prototyping
- Use your preferred IDE for detailed development
- All changes are synced via Git

## Deployment

### Frontend
Simply open [Lovable](https://lovable.dev/projects/8a8433b0-ab60-426a-9ab7-fc1eea41cec2) and click on Share → Publish.

### Backend
Deploy to services like:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS

Make sure to update the `VITE_API_URL` in your frontend `.env` to point to your deployed backend URL.

## License

MIT
