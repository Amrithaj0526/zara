# Zara Application File Structure

## Root Directory
```
zara/
├── app/                          # Main application directory
├── main.py                       # Root entry point for Render deployment
├── render.yaml                   # Render deployment configuration
├── DEPLOYMENT_GUIDE.md          # Complete deployment guide
└── FILE_STRUCTURE.md            # This file
```

## Backend Structure (`app/backend/`)
```
app/backend/
├── api/                          # API routes and endpoints
│   ├── __init__.py
│   ├── auth.py                   # Authentication endpoints
│   ├── feed.py                   # Feed/posts endpoints
│   ├── jobs.py                   # Job board endpoints
│   ├── messaging.py              # Messaging endpoints
│   ├── posts.py                  # Post management endpoints
│   └── profile.py                # User profile endpoints
├── models/                       # Database models
│   ├── __init__.py
│   ├── comment.py                # Comment model
│   ├── job.py                    # Job model
│   ├── message.py                # Message model
│   ├── post.py                   # Post model
│   ├── profile.py                # Profile model
│   └── user.py                   # User model
├── migrations/                   # Database migrations
│   ├── alembic.ini              # Alembic configuration
│   ├── env.py                   # Migration environment
│   ├── README                   # Migration documentation
│   └── versions/                # Migration files
├── venv/                        # Python virtual environment
├── app.py                       # Flask application factory
├── config.py                    # Application configuration
├── extensions.py                 # Flask extensions setup
├── main.py                      # Entry point for Render
└── requirements.txt             # Python dependencies
```

## Frontend Structure (`app/frontend/`)
```
app/frontend/
├── public/                       # Static assets
│   └── vite.svg
├── src/                          # React source code
│   ├── assets/                   # Static assets
│   │   └── react.svg
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication components
│   │   │   ├── api.ts           # Auth API calls
│   │   │   ├── Login.tsx        # Login component
│   │   │   ├── ProtectedRoute.tsx # Route protection
│   │   │   └── Register.tsx     # Registration component
│   │   ├── feed/                 # Feed components
│   │   │   ├── api.ts           # Feed API calls
│   │   │   └── Feed.tsx         # Feed component
│   │   ├── job-board/           # Job board components
│   │   │   ├── api.ts           # Job API calls
│   │   │   └── JobList.tsx      # Job list component
│   │   ├── layout/               # Layout components
│   │   │   └── Layout.tsx       # Main layout
│   │   ├── messaging/           # Messaging components
│   │   │   ├── api.ts           # Messaging API calls
│   │   │   └── MessageList.tsx  # Message list component
│   │   ├── navigation/          # Navigation components
│   │   │   └── Navbar.tsx       # Navigation bar
│   │   ├── posts/               # Post components
│   │   │   ├── api.ts           # Post API calls
│   │   │   ├── PostCreate.tsx   # Post creation
│   │   │   └── PostList.tsx     # Post list
│   │   └── profile/             # Profile components
│   │       ├── api.ts           # Profile API calls
│   │       ├── ProfileEdit.tsx  # Profile editing
│   │       └── ProfileView.tsx  # Profile viewing
│   ├── context/                  # React context
│   │   └── AuthContext.tsx      # Authentication context
│   ├── routes/                   # Routing
│   │   └── index.tsx            # Route definitions
│   ├── services/                 # API services
│   │   └── api.ts               # Base API configuration
│   ├── types/                    # TypeScript types
│   │   └── index.ts             # Type definitions
│   ├── utils/                    # Utility functions
│   │   └── api.ts               # API utilities
│   ├── App.css                   # App styles
│   ├── App.tsx                   # Main App component
│   ├── index.css                 # Global styles
│   └── main.tsx                  # React entry point
├── tests/                        # Test files
│   └── e2e/                     # End-to-end tests
│       └── postCreation.spec.ts # Post creation tests
├── test-results/                 # Test results
├── .eslintrc.cjs                 # ESLint configuration
├── build.sh                      # Build script
├── eslint.config.js              # ESLint config
├── index.html                    # HTML template
├── package.json                  # Node.js dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # Node TypeScript config
├── vite.config.ts                # Vite configuration
└── vite-env.d.ts                # Vite environment types
```

## Uploads Directory
```
app/uploads/                       # File uploads storage
├── profile_11_1751703539.jpg    # Profile images
└── thumb_profile_11_1751703539.jpg # Thumbnail images
```

## Key Files and Their Purposes

### Backend Files
- **`app.py`**: Flask application factory with all routes and middleware
- **`config.py`**: Database and application configuration
- **`main.py`**: Entry point for Render deployment
- **`requirements.txt`**: Python dependencies
- **`extensions.py`**: Flask extensions (SQLAlchemy, JWT, etc.)

### Frontend Files
- **`package.json`**: Node.js dependencies and scripts
- **`vite.config.ts`**: Vite build configuration
- **`App.tsx`**: Main React application component
- **`main.tsx`**: React entry point
- **`index.html`**: HTML template

### Configuration Files
- **`render.yaml`**: Render deployment configuration
- **`main.py`**: Root entry point for backend
- **`.eslintrc.cjs`**: Code linting rules
- **`tailwind.config.js`**: CSS framework configuration

## API Endpoints Structure

### Authentication (`/auth`)
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout
- GET `/auth/profile` - Get user profile

### Posts (`/posts`)
- GET `/posts` - Get all posts
- POST `/posts` - Create new post
- GET `/posts/<id>` - Get specific post
- PUT `/posts/<id>` - Update post
- DELETE `/posts/<id>` - Delete post

### Feed (`/feed`)
- GET `/feed` - Get user feed
- GET `/feed/posts` - Get feed posts

### Jobs (`/jobs`)
- GET `/jobs` - Get all jobs
- POST `/jobs` - Create new job
- GET `/jobs/<id>` - Get specific job
- PUT `/jobs/<id>` - Update job
- DELETE `/jobs/<id>` - Delete job

### Messaging (`/messaging`)
- GET `/messaging` - Get user messages
- POST `/messaging` - Send message
- GET `/messaging/<id>` - Get specific message

### Profile (`/profile`)
- GET `/profile` - Get user profile
- PUT `/profile` - Update profile
- POST `/profile/avatar` - Upload profile picture

## Database Models

### User Model
- Authentication and user management
- JWT token handling
- Password hashing

### Profile Model
- User profile information
- Avatar image handling
- Personal details

### Post Model
- Social media posts
- Content and media
- User associations

### Comment Model
- Post comments
- User associations
- Nested replies

### Job Model
- Job listings
- Company information
- Application handling

### Message Model
- Direct messaging
- User conversations
- Message threading

## Development Workflow

### Backend Development
1. Activate virtual environment: `source app/backend/venv/bin/activate`
2. Install dependencies: `pip install -r app/backend/requirements.txt`
3. Set up database: `flask db upgrade`
4. Run development server: `flask run`

### Frontend Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

### Database Management
1. Create migration: `flask db migrate -m "description"`
2. Apply migrations: `flask db upgrade`
3. Rollback migration: `flask db downgrade`

## Deployment Architecture

### Render Services
1. **PostgreSQL Database**: Persistent data storage
2. **Backend API**: Flask application with gunicorn
3. **Frontend Static Site**: React build served by Render

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Flask session secret
- `JWT_SECRET_KEY`: JWT token signing secret
- `ALLOWED_ORIGINS`: CORS allowed origins
- `VITE_API_URL`: Frontend API endpoint

### Build Process
1. Backend: Install Python dependencies and start gunicorn
2. Frontend: Install Node.js dependencies and build static files
3. Database: Automatically provisioned by Render

## Security Features

### Backend Security
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation

### Frontend Security
- Protected routes
- Token-based authentication
- Secure API calls
- XSS protection

### Database Security
- Parameterized queries
- SQL injection protection
- Connection encryption
- Access control 