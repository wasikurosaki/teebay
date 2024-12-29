# 🛍️ Product Rental & Sales Platform

A full-stack application for buying and renting products with user authentication.

## 🌟 Features

- 👤 User authentication with JWT
- 🏷️ Product listing and management
- 💰 Purchase products
- ⏰ Rental system with time frame validation

## 🔧 Tech Stack

- Backend:
  - Node.js
  - GraphQL
  - PostgreSQL
  - Prisma
- Frontend:
  - React
  - Apollo Client

## 🚀 Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your_secret_key>
PORT=3000
```

### Backend Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Deploy database migrations:

```bash
npx prisma migrate deploy
```

4. Start development server:

```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start frontend server:

```bash
npm start
```

## 📚 API Documentation

### User Endpoints

#### 🔐 Signup

```graphql
POST localhost:3000/graphql
{
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  address: String!
}
```

#### 🔑 Login

```graphql
POST localhost:3000/graphql
{
  email: String!
  password: String!
}
```

### Product Endpoints

#### 📝 Create Product

```graphql
POST localhost:3000/graphql
{
  name: String!
  description: String!
  price: Float!
  categories: [Int!]!
  userId: Int!
  rentPrice: Float!
  rentType: String!
}
```

#### 🔄 Update Product

```graphql
PUT localhost:3000/graphql
{
  id: Int!
  name: String
  description: String
  price: Float
  categories: [Int!]
  rentPrice: Float
  rentType: String
}
```

#### 💳 Buy Product

```graphql
POST localhost:3000/graphql
{
  id: Int!
  userId: Int!
  buyerId: Int!
}
```

#### 📅 Rent Product

```graphql
POST localhost:3000/graphql
{
  id: Int!
  userId: Int!
  rentStart: String!
  rentEnd: String!
  buyerId: Int!
}
```

## 🔒 Authentication

All protected routes require JWT authentication. Add the token to your request headers:

```
Authorization: Bearer <your_token>
```

## 💡 Developer Notes

This project implements a robust rental validation system that prevents double-booking of products during overlapping time periods. The backend validates rental requests against existing bookings to ensure availability.

## 👨‍💻 My Experience

This project was a great learning experience for me as I got to work with some new technologies. I started by designing the database using PostgreSQL and Prisma, which was a fun and insightful process. Once the database structure was ready, I moved on to creating the resolvers and controllers. Implementing the login and signup functionality was straightforward, and I didn't face any major hurdles there.

After completing all the APIs, I tested them thoroughly using Postman to ensure they worked as expected. Once I had the backend foundation ready, I began working on the frontend. To be honest, I didn't focus much on the design aspect. Looking back, there are plenty of ways I could have improved the UI, but I decided to concentrate more on ensuring the features and functionality worked smoothly.

One tricky part of the project was handling a specific corner case for the "rent product" feature. The challenge was to check the rental period to make sure that a product couldn't be rented by someone else during an overlapping time frame. I solved this by adding the necessary checks and logic in the rent product controller, which felt rewarding once it was working perfectly.

Overall, it was a fulfilling experience, and I'm happy with how I was able to tackle the tasks while learning along the way. There's definitely room for improvement, but I feel I've grown a lot through this project!

## 🎨 Future Improvements

- Enhanced UI/UX design
- Advanced search filters
- User reviews and ratings
- Payment gateway integration
- Real-time notifications
