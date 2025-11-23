# API Security Gateway - Implementation

This is the **actual working implementation** of the API Security Gateway with OAuth2 and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Redis server running

### Installation

```bash
npm install
```

### Generate RSA Keys

```bash
# Generate private and public keys for JWT signing
npm run generate-keys
```

This will create `private.key` and `public.key` files.

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:4000`

## 🔐 Authentication Flow

### 1. Login (Get Access Token)

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### 2. Access Protected Resources

```bash
curl http://localhost:4000/api/data \
  -H "Authorization: Bearer {access_token}"
```

### 3. Refresh Access Token

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "{refresh_token}"
  }'
```

## 🔧 Features Implemented

✅ **JWT Authentication** - RS256 algorithm with RSA keys  
✅ **Access & Refresh Tokens** - 15min access, 30day refresh  
✅ **Token Revocation** - Redis-backed revocation list  
✅ **Rate Limiting** - 100 requests per minute per IP  
✅ **Security Headers** - Helmet.js protection  
✅ **Password Hashing** - Bcrypt with salt rounds  

## 📊 Rate Limiting

The gateway enforces rate limits:
- **100 requests per minute** per IP address
- Blocked for 60 seconds if exceeded
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Test Rate Limiting

```bash
# Send 101 requests quickly
for i in {1..101}; do
  curl http://localhost:4000/health
done
```

The 101st request will return `429 Too Many Requests`.

## 🔑 JWT Token Structure

### Access Token Payload
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "permissions": ["read", "write"],
  "iat": 1234567890,
  "exp": 1234568790,
  "iss": "api-gateway",
  "jti": "unique-token-id"
}
```

### Refresh Token Payload
```json
{
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1237159890,
  "jti": "unique-token-id"
}
```

## 🛡️ Security Features

### 1. Token Revocation

Revoke a token (requires admin endpoint - not implemented):
```javascript
await redisClient.set(`revoked:${token}`, '1', 'EX', 900);
```

### 2. Password Security

Passwords are hashed with bcrypt:
```javascript
const hash = await bcrypt.hash(password, 10);
```

### 3. Security Headers

Helmet.js adds:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`

## 📡 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Protected Endpoints (Require JWT)
- `GET /api/data` - Get protected data
- `GET /api/profile` - Get user profile

## 🏗️ Architecture

```
src/
├── server.js              # Main Express application
├── middleware/
│   ├── jwt.js            # JWT verification middleware
│   └── rateLimiter.js    # Rate limiting middleware
└── routes/
    ├── auth.js           # Authentication endpoints
    └── protected.js      # Protected endpoints
```

## 🧪 Testing

### Valid Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Invalid Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"wrong"}'
```

### Access Without Token
```bash
curl http://localhost:4000/api/data
# Returns 401 Unauthorized
```

### Access With Expired Token
```bash
# Wait 15 minutes after login
curl http://localhost:4000/api/data \
  -H "Authorization: Bearer {expired_token}"
# Returns 401 Token expired
```

## 🔐 Environment Variables

```bash
PORT=4000
REDIS_URL=redis://localhost:6379
JWT_PRIVATE_KEY=path/to/private.key
JWT_PUBLIC_KEY=path/to/public.key
```

## 📝 Default Test User

```
Email: user@example.com
Password: password123
Permissions: read, write
```

## 🚀 Production Considerations

1. **Use environment variables** for keys (not files)
2. **Enable HTTPS** for token transmission
3. **Implement token rotation** on refresh
4. **Add user registration** endpoint
5. **Implement OAuth2 flows** (authorization code, client credentials)
6. **Add CORS configuration** for specific origins
7. **Implement WAF rules** for SQL injection, XSS
8. **Add logging** to SIEM system
