# Studio Booking Assistant

A comprehensive web application designed to help recording studios efficiently manage their bookings, staff, clients, and communications.

## Features

- **Booking Management**: Calendar view, booking creation/editing, availability checking, conflict prevention
- **Client Management**: Client profiles, history, and communication tracking
- **Staff Management**: Staff scheduling, skill tracking, and session assignment
- **Studio Management**: Multiple studio support with customizable operating hours
- **Equipment Management**: Inventory, reservations, and maintenance scheduling
- **Communication Tools**: Automated notifications and custom email templates
- **Payment Processing**: Deposit collection, invoice generation, payment tracking
- **Reporting and Analytics**: Studio utilization and revenue tracking

## Tech Stack

### Frontend
- React.js with Next.js
- Material-UI
- Redux for state management
- FullCalendar.js for calendar views
- Formik with Yup for form validation

### Backend
- Node.js with Express.js
- JWT authentication
- SendGrid for email services
- Stripe for payment processing

### Database
- PostgreSQL
- Sequelize ORM
- Redis for caching

### DevOps
- Docker containerization
- AWS for hosting
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dxaginfo/dx-studio-booking-assistant.git
cd dx-studio-booking-assistant
```

2. Start with Docker Compose:
```bash
docker-compose up
```

This will start all services including:
- Frontend (Next.js) - accessible at http://localhost:3000
- Backend (Express.js) - accessible at http://localhost:5000
- PostgreSQL database
- Redis cache
- Adminer (database management) - accessible at http://localhost:8080

### Manual Setup (Alternative)

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## Configuration

1. Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/studio_booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

2. Create a `.env.local` file in the client directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Migrations

To initialize and migrate the database:

```bash
cd server
npm run db:migrate
npm run db:seed
```

## Project Structure

```
├── client/               # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js page components
│   ├── redux/            # Redux state management
│   └── styles/           # CSS and styled-components
├── server/               # Backend Node.js/Express application
│   ├── config/           # Server configuration
│   ├── controllers/      # Request handlers
│   ├── db/               # Database models and migrations
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   └── services/         # Business logic
├── shared/               # Shared utilities and types
├── docker/               # Docker configuration
└── scripts/              # Utility scripts
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Documentation

For detailed project documentation, see the [Project Plan](https://docs.google.com/document/d/1KTmJiWq6mTkyFnZJdHW-m5ndQsQTgYOhgWs5zZeOL_A/edit).

For development tracking, see the [Development Tracking Sheet](https://docs.google.com/spreadsheets/d/1RH2QcAyKqkzs1G2C_M-4-3XvztZ1DRWvSmFFajHirbM/edit).