# Studio Booking Assistant

A comprehensive web application for recording studios to manage bookings, coordinate staff, and communicate with clients.

## Features

- **Studio Calendar and Booking Management**: View all bookings in a calendar interface, see available time slots, and set operating hours
- **Client Management**: Store client information, manage profiles, and add session notes
- **Staff Coordination**: Assign engineers to sessions, view schedules, and manage staff availability
- **Equipment Management**: Inventory available equipment, request specific gear for sessions
- **Automated Communications**: Send booking confirmations, preparation instructions, and follow-up emails
- **Payment Processing**: Secure online payments, deposits, and payment tracking
- **Reporting and Analytics**: View studio utilization, identify peak booking times, and track revenue

## Technology Stack

### Frontend
- React.js with Next.js
- Material-UI components
- Redux state management
- FullCalendar.js

### Backend
- Node.js with Express.js
- JWT authentication
- SendGrid for emails
- Stripe payment processing

### Database
- PostgreSQL
- Sequelize ORM
- Redis caching

### Deployment
- Docker containerization
- AWS hosting
- GitHub Actions CI/CD

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Redis

### Installation

1. Clone the repository
   ```
   git clone https://github.com/dxaginfo/dx-studio-booking-assistant.git
   cd dx-studio-booking-assistant
   ```

2. Install dependencies
   ```
   npm install
   ```
   
3. Set up environment variables
   ```
   cp .env.example .env
   ```
   
   Then edit `.env` with your database credentials, API keys, etc.

4. Run database migrations
   ```
   npm run db:migrate
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open your browser to http://localhost:3000

## Project Structure

```
├── client/                # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/             # Next.js page components
│   ├── redux/             # Redux state management
│   └── styles/            # CSS and styled-components
├── server/                # Backend Node.js/Express application
│   ├── config/            # Server configuration
│   ├── controllers/       # Request handlers
│   ├── db/                # Database models and migrations
│   ├── middleware/        # Express middleware
│   ├── routes/            # API route definitions
│   └── services/          # Business logic
├── shared/                # Shared utilities and types
├── docker/                # Docker configuration
└── scripts/               # Utility scripts
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## Deployment

### Docker

Build and run with Docker:

```
docker-compose up -d
```

### Manual Deployment

For production deployment to AWS:

1. Build the application
   ```
   npm run build
   ```

2. Deploy using the AWS CLI
   ```
   npm run deploy
   ```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FullCalendar.js for the calendar interface
- Material-UI for the component library