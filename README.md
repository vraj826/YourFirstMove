# YourFirstMove - Productivity Application

A full-stack productivity platform for managing daily and monthly tasks. Features include an interactive visual roadmap, automated SMS notifications, real-time progress tracking, and gamified productivity features.

## Features

- **Visual Timeline Roadmap**: 24-hour schedule view with tasks mapped to specific times and current time indicator
- **List View**: Drag-and-drop task reordering 
- **Monthly Calendar View**: Overview with task counts and completion rates
- **Automated SMS Notifications**: Critical task reminders via Twilio
- **Real-Time Progress Tracking**: Live completion percentages and analytics
- **Productivity Streaks**: Gamified daily completion tracking
- **Progressive Web App**: Offline functionality with background sync
- **Analytics Dashboard**: Productivity trends and statistics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Technology Stack

### Frontend
- Angular 17+
- TypeScript 5+
- Tailwind CSS
- Angular Material
- Chart.js
- RxJS
- Angular Service Worker (PWA)

### Backend
- Node.js 20+ LTS
- Express.js 4.x
- TypeScript
- MySQL 8.0+
- Knex.js (database migrations)
- Objection.js (ORM)
- JWT authentication
- node-cron (scheduled jobs)
- Twilio API (SMS)

## Prerequisites

- Node.js 20+ LTS
- MySQL 8.0+
- npm or yarn
- Twilio account (for SMS notifications)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd yourfirstmove
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables

**Backend (.env in backend/ directory):**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourfirstmove
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Notification
NOTIFICATION_WINDOW_MINUTES=30

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (environment.ts in frontend/src/environments/):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### 4. Set up the database

Create MySQL database:
```sql
CREATE DATABASE yourfirstmove CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations:
```bash
npm run migrate:latest
```

## Running the Application

### Development Mode

**Start backend server:**
```bash
npm run dev:backend
```
Backend will run on http://localhost:3000

**Start frontend development server:**
```bash
npm run dev:frontend
```
Frontend will run on http://localhost:4200

### Production Mode

**Build backend:**
```bash
npm run build:backend
```

**Build frontend:**
```bash
npm run build:frontend
```

**Start production server:**
```bash
cd backend && npm start
```

## Testing

**Run backend tests:**
```bash
npm run test:backend
```

**Run frontend tests:**
```bash
npm run test:frontend
```

## Database Migrations

**Run pending migrations:**
```bash
npm run migrate:latest
```

**Rollback last migration:**
```bash
npm run migrate:rollback
```

**Create new migration:**
```bash
cd backend
npx knex migrate:make migration_name
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Invalidate session
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset
- `GET /api/auth/me` - Get current user profile

### Task Endpoints

- `GET /api/tasks` - List tasks (with pagination, filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `PATCH /api/tasks/:id/reorder` - Update task order
- `GET /api/tasks/daily/:date` - Get tasks for specific date
- `GET /api/tasks/monthly/:month` - Get tasks for specific month

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update preferences

### Analytics Endpoints

- `GET /api/analytics/completion` - Get completion rate data
- `GET /api/analytics/trends` - Get productivity trends
- `GET /api/analytics/streaks` - Get streak history

## Architecture

```
┌─────────────────────────────────────────┐
│         Angular SPA (Frontend)          │
│  - Components, Services, Guards         │
│  - PWA with Service Worker              │
└─────────────────┬───────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────┐
│    Node.js + Express.js (Backend)       │
│  - Routes, Controllers, Middleware      │
│  - Background Jobs (node-cron)          │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────┐
│         MySQL Database                   │
│  - users, tasks, streaks, notifications │
└──────────────────────────────────────────┘
```

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- HTTPS enforcement in production
- SQL injection prevention via parameterized queries
- XSS protection with input sanitization
- CORS policy enforcement
- Rate limiting (100 requests/minute)
- Helmet.js security headers

## Performance Optimizations

- Lazy loading for Angular routes
- Virtual scrolling for large task lists
- Database connection pooling
- API response caching
- Pagination (50 items per page)
- Database indexes on frequently queried columns

## Deployment

### Production Checklist

- Set `NODE_ENV=production`
- Configure production database credentials
- Set strong JWT secret
- Configure Twilio credentials
- Enable HTTPS
- Set appropriate CORS origins
- Set up database backups
- Run security audit: `npm audit`

### Recommended Hosting

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: AWS EC2, DigitalOcean, Heroku
- **Database**: AWS RDS, DigitalOcean Managed MySQL

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
