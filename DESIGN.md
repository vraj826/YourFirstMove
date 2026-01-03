# YourFirstMove - System Design & Architecture

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Security Architecture](#security-architecture)
10. [Performance Optimization](#performance-optimization)
11. [Deployment Architecture](#deployment-architecture)

---

## Overview

YourFirstMove is a production-ready full-stack productivity application built with Angular, Node.js/Express, and MySQL. The system provides an intuitive visual roadmap interface for task management, automated SMS notifications for critical tasks, and gamified productivity tracking.

### Key Design Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **RESTful API Design**: Stateless, resource-oriented endpoints following HTTP standards
3. **Progressive Enhancement**: Core functionality works offline via PWA capabilities
4. **Security First**: Authentication, authorization, input validation, and data encryption
5. **Performance Optimization**: Lazy loading, caching, pagination, and virtual scrolling
6. **Scalability**: Stateless backend design enabling horizontal scaling
7. **Maintainability**: Modular architecture with clear interfaces
8. **Modern Design**: Extraordinary SaaS aesthetic with glassmorphism and smooth animations

---

## Design System

### Visual Identity

**Aesthetic**: Modern SaaS Dark Mode inspired by Linear, Stripe, and Vercel

**Core Principles**:
- Glassmorphism with backdrop blur (8-16px)
- Smooth micro-interactions (200-300ms transitions)
- Consistent border-radius (8-12px)
- Soft shadows with layered depth
- Deep neutrals with vibrant accents
- Inter font family for UI
- CSS variables for centralized theming

### Color Palette

**Dark Mode (Primary)**:
```
Background:        #0a0c0f (Deep black)
Surface:           #1a1d23 (Dark gray)
Surface Elevated:  #242830 (Lighter gray)
Border:            rgba(255, 255, 255, 0.08)

Text Primary:      #f8fafc (Near white)
Text Secondary:    #cbd5e1 (Light gray)
Text Tertiary:     #94a3b8 (Medium gray)

Primary:           #818cf8 (Indigo)
Primary Hover:     #a5b4fc (Light indigo)
Accent:            #c084fc (Purple)

Success:           #22c55e (Green)
Warning:           #f59e0b (Amber)
Error:             #ef4444 (Red)
```

**Light Mode**:
```
Background:        #ffffff (White)
Surface:           #fafafa (Off-white)
Text Primary:      #0f172a (Dark slate)
Primary:           #6366f1 (Indigo)
```

### Typography Scale

```
H1: 3rem (48px) - Bold, -2% letter-spacing
H2: 2.25rem (36px) - Bold
H3: 1.875rem (30px) - Bold
H4: 1.5rem (24px) - Semibold
H5: 1.25rem (20px) - Semibold
Body: 1rem (16px) - Regular
Small: 0.875rem (14px) - Regular
```

### Component Patterns

**Cards**:
- Background: `var(--color-surface-elevated)`
- Border: `1px solid var(--color-border)`
- Border Radius: `var(--radius-lg)` (12px)
- Padding: `1.5rem`
- Shadow: `var(--shadow-sm)`
- Hover: Lift 2px + shadow-md

**Buttons**:
- Primary: Gradient background, white text, shadow
- Secondary: Surface background, border, text color
- Ghost: Transparent, hover with primary-light background
- Border Radius: `var(--radius-md)` (8px)
- Padding: `0.625rem 1.25rem`
- Transition: 250ms ease-in-out

**Inputs**:
- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)`
- Focus: Primary border + 3px primary-light shadow
- Border Radius: `var(--radius-md)` (8px)
- Padding: `0.625rem 0.875rem`

**Glassmorphism**:
```css
.glass {
  background: rgba(26, 29, 35, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-strong {
  background: rgba(36, 40, 48, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

### Animation Guidelines

**Transitions**:
- Fast: 150ms (hover states)
- Base: 250ms (standard interactions)
- Slow: 350ms (page transitions)
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Keyframe Animations**:
- fadeIn: Opacity 0 → 1 (300ms)
- slideUp: TranslateY(10px) → 0 (300ms)
- scaleIn: Scale(0.95) → 1 (200ms)
- pulse: Opacity animation for current hour

### Priority Color System

```
Low:      #22c55e (Green) - Left border 3px
Medium:   #f59e0b (Amber) - Left border 3px
High:     #f97316 (Orange) - Left border 3px
Critical: #ef4444 (Red) - Left border 3px
```

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Angular SPA (Frontend)                      │    │
│  │  - Components (Roadmap, Calendar, Analytics)       │    │
│  │  - Services (API, State Management, PWA)           │    │
│  │  - Guards (Auth, Route Protection)                 │    │
│  │  - Interceptors (Auth Token, Error Handling)       │    │
│  │  - Modern Design System (CSS Variables, Glass)     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Node.js + Express.js (Backend API)            │    │
│  │  - Routes (Auth, Tasks, Users, Analytics)          │    │
│  │  - Controllers (Business Logic)                    │    │
│  │  - Middleware (Auth, Validation, Error Handling)   │    │
│  │  - Services (Task, User, Notification, Analytics)  │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Background Job Scheduler (node-cron)          │    │
│  │  - Notification Dispatcher (every minute)          │    │
│  │  - Streak Calculator (daily at midnight)           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries (Objection.js/Knex)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │              MySQL Database                         │    │
│  │  - users                                            │    │
│  │  - tasks                                            │    │
│  │  - productivity_streaks                             │    │
│  │  - notifications                                    │    │
│  │  - user_preferences                                 │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  - Twilio API (SMS Notifications)                           │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → Angular Component → Service → HTTP Interceptor → 
Backend API → Middleware → Controller → Service → 
Objection.js Model → Knex Query → MySQL → Response
```

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17+ | SPA Framework |
| TypeScript | 5+ | Type Safety |
| Tailwind CSS | 3.4+ | Utility-first Styling |
| Angular Material | 17+ | UI Components |
| Chart.js | 4.4+ | Data Visualization |
| RxJS | 7.8+ | Reactive Programming |
| Angular Service Worker | 17+ | PWA Capabilities |
| Angular CDK | 17+ | Drag-Drop Functionality |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ LTS | Runtime Environment |
| Express.js | 4.x | Web Framework |
| TypeScript | 5+ | Type Safety |
| MySQL | 8.0+ | Relational Database |
| Knex.js | 3.1+ | Query Builder & Migrations |
| Objection.js | 3.1+ | ORM Layer |
| JWT | 9.0+ | Authentication |
| bcrypt | 5.1+ | Password Hashing |
| node-cron | 3.0+ | Job Scheduling |
| Twilio | 4.19+ | SMS Service |
| Winston | 3.11+ | Logging |
| Helmet | 7.1+ | Security Headers |
| express-rate-limit | 7.1+ | Rate Limiting |
| Joi | 17.11+ | Validation |

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ name            │
│ phone_number    │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:M
         │
┌────────▼────────┐
│     tasks       │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ description     │
│ due_date        │
│ due_time        │
│ priority        │
│ is_critical     │
│ is_completed    │
│ completed_at    │
│ display_order   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:M
         │
┌────────▼────────────┐
│   notifications     │
├─────────────────────┤
│ id (PK)             │
│ task_id (FK)        │
│ user_id (FK)        │
│ phone_number        │
│ message             │
│ status              │
│ sent_at             │
│ retry_count         │
│ error_message       │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────────┐
│ productivity_streaks    │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK) UNIQUE     │
│ current_streak          │
│ longest_streak          │
│ last_activity_date      │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────────┐
│   user_preferences      │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK) UNIQUE     │
│ theme                   │
│ notification_enabled    │
│ notification_timing     │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

### Database Schema Details

#### users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

#### tasks Table
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  is_critical BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, due_date),
  INDEX idx_user_priority (user_id, priority),
  INDEX idx_critical_tasks (is_critical, due_date, due_time)
);
```

### Indexing Strategy

1. **Primary Keys**: Auto-increment integers for fast lookups
2. **Foreign Keys**: Indexed for join performance
3. **Composite Indexes**: (user_id, due_date) for date-based queries
4. **Unique Constraints**: Email, user preferences, streaks
5. **Covering Indexes**: Critical task queries

---

## API Design

### RESTful Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register          - Create new user account
POST   /api/auth/login             - Authenticate user
POST   /api/auth/logout            - Invalidate session
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Complete password reset
GET    /api/auth/me                - Get current user profile
```

#### Task Endpoints
```
GET    /api/tasks                  - List tasks (with pagination, filters)
POST   /api/tasks                  - Create new task
GET    /api/tasks/:id              - Get single task
PUT    /api/tasks/:id              - Update task
DELETE /api/tasks/:id              - Delete task
PATCH  /api/tasks/:id/complete     - Mark task complete
PATCH  /api/tasks/reorder          - Update task order
GET    /api/tasks/daily/:date      - Get tasks for specific date
GET    /api/tasks/monthly/:month   - Get tasks for specific month
```

#### User Endpoints
```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
GET    /api/users/preferences      - Get user preferences
PUT    /api/users/preferences      - Update preferences
```

#### Analytics Endpoints
```
GET    /api/analytics/completion   - Get completion rate data
GET    /api/analytics/trends       - Get productivity trends
GET    /api/analytics/streaks      - Get streak history
GET    /api/analytics/statistics   - Get task statistics
```

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2026-01-03T12:00:00Z",
  "path": "/api/auth/register"
}
```

---

## Frontend Architecture

### Component Structure

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── task.model.ts
│   └── services/
│       ├── auth.service.ts
│       ├── task.service.ts
│       ├── analytics.service.ts
│       ├── user.service.ts
│       └── theme.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── roadmap/
│   ├── monthly-calendar/
│   ├── analytics/
│   ├── settings/
│   └── tasks/
│       ├── task-form/
│       ├── task-list/
│       └── task-item/
├── shared/
│   └── components/
│       └── loading-spinner/
├── app-routing.module.ts
├── app.module.ts
└── app.component.ts
```

### State Management

- **RxJS BehaviorSubjects** for reactive state
- **Services** as state containers
- **Observables** for data streams
- **Local Storage** for persistence

### Routing Strategy

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'roadmap', component: RoadmapComponent },
      { path: 'calendar', component: MonthlyCalendarComponent },
      { path: 'analytics', component: AnalyticsDashboardComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
```

---

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Routes Layer                │
│  - Define endpoints                 │
│  - Apply middleware                 │
│  - Route to controllers             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Middleware Layer               │
│  - Authentication                   │
│  - Validation                       │
│  - Error handling                   │
│  - Rate limiting                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Controller Layer              │
│  - Request handling                 │
│  - Response formatting              │
│  - Call services                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Service Layer                │
│  - Business logic                   │
│  - Data validation                  │
│  - External API calls               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Model Layer                 │
│  - Objection.js models              │
│  - Database queries                 │
│  - Relations                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Database Layer               │
│  - MySQL                            │
│  - Connection pooling               │
└─────────────────────────────────────┘
```

### Service Architecture

**AuthService:**
- User registration
- Login/logout
- Token generation/validation
- Password hashing

**TaskService:**
- CRUD operations
- Filtering and search
- Pagination
- Reordering

**NotificationService:**
- SMS sending via Twilio
- Retry logic
- Notification scheduling

**AnalyticsService:**
- Completion rate calculation
- Trend analysis
- Streak tracking

**SchedulerService:**
- Cron job management
- Background task execution

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Backend validates credentials
3. Password compared with bcrypt
4. JWT token generated
5. Token sent to client
6. Client stores token in localStorage
7. Token attached to all requests via interceptor
8. Backend validates token on each request
```

### Security Layers

1. **Transport Security**
   - HTTPS in production
   - Secure cookies
   - CORS configuration

2. **Authentication**
   - JWT tokens (7-day expiry)
   - bcrypt password hashing (10 rounds)
   - Token validation on each request

3. **Authorization**
   - User ownership verification
   - Route guards
   - Resource-level permissions

4. **Input Validation**
   - Joi schema validation
   - SQL injection prevention (parameterized queries)
   - XSS protection (input sanitization)

5. **Rate Limiting**
   - 100 requests per minute per user
   - Prevents brute force attacks

6. **Security Headers**
   - Helmet.js middleware
   - CSP, X-Frame-Options, etc.

---

## Performance Optimization

### Frontend Optimizations

1. **Lazy Loading**
   - Route-based code splitting
   - Component lazy loading

2. **Virtual Scrolling**
   - Large list rendering
   - CDK Virtual Scroll

3. **Change Detection**
   - OnPush strategy
   - Immutable data patterns

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression

### Backend Optimizations

1. **Database**
   - Connection pooling (2-10 connections)
   - Optimized indexes
   - Query optimization

2. **Caching**
   - In-memory caching
   - Cache invalidation strategies

3. **Pagination**
   - 50 items per page default
   - Cursor-based pagination ready

4. **Logging**
   - Performance monitoring
   - Slow query detection (>500ms)

---

## Deployment Architecture

### Production Deployment

```
┌─────────────────────────────────────┐
│         Load Balancer               │
│         (Nginx/AWS ALB)             │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐ ┌─────▼───────┐
│  Frontend   │ │  Frontend   │
│  (Static)   │ │  (Static)   │
│  CDN/S3     │ │  CDN/S3     │
└─────────────┘ └─────────────┘

┌─────────────────────────────────────┐
│         API Gateway                 │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐ ┌─────▼───────┐
│  Backend    │ │  Backend    │
│  Instance 1 │ │  Instance 2 │
│  (Node.js)  │ │  (Node.js)  │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               │
┌──────────────▼──────────────────────┐
│         MySQL Database              │
│         (RDS/Managed)               │
└─────────────────────────────────────┘
```

### Environment Configuration

**Development:**
- Local MySQL
- Hot reload
- Debug logging
- No rate limiting

**Production:**
- Managed MySQL (RDS)
- PM2 process manager
- Error logging only
- Full security enabled

### Monitoring & Logging

1. **Application Logs**
   - Winston file rotation
   - Error tracking
   - Performance metrics

2. **Database Monitoring**
   - Query performance
   - Connection pool status
   - Slow query log

3. **External Services**
   - Twilio API status
   - SMS delivery rates

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: No session storage on server
- **Database Connection Pooling**: Shared connections
- **Load Balancing**: Multiple backend instances
- **CDN**: Static asset distribution

### Vertical Scaling

- **Database Optimization**: Indexes, query optimization
- **Caching Layer**: Redis for session/data caching
- **Background Jobs**: Separate worker processes

### Future Enhancements

1. **Microservices**: Split into auth, tasks, notifications services
2. **Message Queue**: RabbitMQ/Redis for async processing
3. **Caching**: Redis for frequently accessed data
4. **CDN**: CloudFront/Cloudflare for global distribution
5. **Database Replication**: Read replicas for scaling reads

---

## Conclusion

This architecture provides a solid foundation for a production-ready productivity application with:

- ✅ Clean separation of concerns
- ✅ Scalable design
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Maintainable codebase
- ✅ Comprehensive error handling
- ✅ Monitoring and logging

The system is designed to handle growth while maintaining code quality and user experience.
