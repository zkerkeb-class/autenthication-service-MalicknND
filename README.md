# OpenID Connect Server

This is the backend server for an OpenID Connect authentication system, primarily configured to work with Google OAuth 2.0.

## Technologies Used

- Node.js & Express.js - Backend framework
- Passport.js - Authentication middleware
- OpenID Connect - Authentication protocol
- MongoDB - Database
- Express Session - Session management
- CORS - Cross-Origin Resource Sharing

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:8000
   MONGODB_URI=your_mongodb_connection_string
   ```

## Environment Variables

- `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 client secret
- `SESSION_SECRET`: Secret key for session encryption
- `FRONTEND_URL`: URL of your frontend application
- `BACKEND_URL`: URL of this backend server
- `MONGODB_URI`: MongoDB connection string

## Available Scripts

- `npm run dev`: Starts the server in development mode with nodemon
- `npm start`: Starts the server in production mode
- `npm test`: Runs the test suite (currently not configured)

## API Endpoints

### Authentication
- `GET /auth/google`: Initiates Google OAuth2 authentication
- `GET /auth/google/callback`: Callback URL for Google OAuth2
- `GET /user`: Returns the currently authenticated user
- `POST /logout`: Logs out the current user

## Security Features

- CORS configuration with credentials
- Session-based authentication
- Secure cookie handling
- OpenID Connect protocol implementation

## Development

The server is configured to work with a React frontend application. It uses:
- CORS to handle cross-origin requests
- Express sessions for maintaining user sessions
- Passport.js for handling authentication
- MongoDB for data persistence

## Production Considerations

Before deploying to production:
1. Set appropriate CORS origins
2. Configure secure session storage
3. Set up proper MongoDB indexes
4. Enable HTTPS
5. Set secure cookie options

