# YourFirstMove - Production-Ready Productivity Application

A high-end, full-stack productivity application with an **extraordinary modern SaaS dark mode design** inspired by Linear, Stripe, and Vercel. Manage your daily and monthly tasks through an intuitive visual roadmap interface with automated SMS notifications, real-time progress tracking, and gamified productivity features.

## ✨ Design System

### Modern SaaS Aesthetic
- **Glassmorphism**: Backdrop blur effects with subtle transparency
- **Smooth Micro-interactions**: 200-300ms transitions with ease-in-out curves
- **Consistent Border Radius**: 8-12px for unified visual language
- **Soft Shadows**: Layered depth with subtle elevation
- **Typography**: Inter font family for clean, modern UI
- **Color System**: Deep neutrals with vibrant purple/blue accents
- **Dark Mode First**: Optimized for low-light environments
- **CSS Variables**: Centralized design tokens for easy theming

### Key Visual Features
- Glassmorphic sidebar with backdrop blur
- Gradient text effects on headings
- Hover lift animations on interactive elements
- Glow effects on primary actions
- Smooth page transitions and animations
- Priority color coding (green → yellow → orange → red)
- Custom scrollbar styling
- Focus rings for accessibility

## Features

- **Visual Timeline Roadmap**: 24-hour schedule view with tasks mapped to specific times
  - Hour-by-hour time slots with glassmorphic cards
  - Current time indicator (red line with glow)
  - Current hour highlighting with pulse animation
  - Unscheduled tasks section
  - Priority color coding with left border accents
  - Toggle between Timeline and List views
- **List View**: Drag-and-drop task reordering with smooth animations
- **Monthly Calendar View**: Bird's-eye perspective with task counts and completion rates
- **Automated SMS Notifications**: Critical task reminders via Twilio
- **Real-Time Progress Tracking**: Live completion percentages with gradient progress bars
- **Productivity Streaks**: Gamified daily completion tracking with milestone badges
- **Progressive Web App**: Offline functionality with background sync
- **Theme Customization**: Light, Dark, and Custom themes with WCAG 2.1 AA compliance
- **Analytics Dashboard**: Visual charts with glassmorphic cards showing productivity trends
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile

## Technology Stack

### Frontend
- Angular 17+
- TypeScript 5+
- Tailwind CSS (with custom design tokens)
- Angular Material (with custom theme overrides)
- Chart.js
- RxJS
- Angular Service Worker (PWA)
- **Modern CSS**: CSS Variables, Backdrop Filters, Animations

### Backend
- Node.js 20+ LTS
- Express.js 4.x
- TypeScript
- MySQL 8.0+
- Knex.js (migrations & query building)
- Objection.js (ORM)
- JWT authentication
- bcrypt password hashing
- node-cron (scheduled jobs)
- Winston (logging)
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

- HTTPS enforcement in production
- JWT-based authentication
- bcrypt password hashing
- SQL injection prevention via parameterized queries
- XSS protection with input sanitization
- CSRF protection
- CORS policy enforcement
- Rate limiting (100 requests/minute per user)
- Helmet.js security headers
- Strong password requirements

## Performance Optimizations

- Lazy loading for Angular routes
- Virtual scrolling for large task lists
- Database connection pooling
- API response caching
- Pagination (50 items per page)
- Database indexes on frequently queried columns
- Bundle size optimization with tree shaking

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Set strong JWT secret
4. Configure Twilio credentials
5. Enable HTTPS
6. Set appropriate CORS origins
7. Configure log rotation
8. Set up database backups
9. Configure monitoring and alerting
10. Run security audit: `npm audit`

### Recommended Hosting

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: AWS EC2, DigitalOcean, Heroku
- **Database**: AWS RDS, DigitalOcean Managed MySQL
- **Monitoring**: Sentry, DataDog, New Relic

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
