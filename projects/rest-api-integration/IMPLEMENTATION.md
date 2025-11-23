# REST API Integration Hub - Implementation

This is the **actual working implementation** of the REST API Integration Hub showcased in the portfolio.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Redis server running locally or accessible remotely
- API keys for third-party services (optional for testing)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your API keys (optional for basic testing)
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Payment APIs

#### Create Stripe Charge
```bash
POST /api/payments/stripe/charge
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "usd",
  "source": "tok_visa",
  "description": "Test charge"
}
```

#### Create PayPal Payment
```bash
POST /api/payments/paypal/payment
Content-Type: application/json

{
  "amount": 50.00,
  "currency": "USD",
  "description": "Test payment"
}
```

#### Get Payment Status
```bash
GET /api/payments/status/:provider/:paymentId
```

### Shipping APIs

#### Get Shipping Rates
```bash
POST /api/shipping/rates
Content-Type: application/json

{
  "carrier": "fedex",
  "origin": { "zip": "10001" },
  "destination": { "zip": "90210" },
  "package": { "weight": 5, "length": 10, "width": 8, "height": 6 }
}
```

#### Track Shipment
```bash
GET /api/shipping/track/:carrier/:trackingNumber
```

## 🔧 Features Implemented

✅ **Rate Limiting** - Redis-backed token bucket algorithm  
✅ **Caching** - Automatic response caching with configurable TTL  
✅ **Error Handling** - Centralized error handling with logging  
✅ **Request Logging** - Winston logger with file and console output  
✅ **Payment Integration** - Stripe and PayPal services  
✅ **Shipping Integration** - FedEx and UPS mock services  
✅ **Security** - Helmet.js security headers  
✅ **Compression** - Response compression middleware  

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📊 Monitoring

Logs are stored in:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

## 🔐 Environment Variables

See `.env.example` for all available configuration options.

## 📝 Notes

- Mock implementations are used for FedEx and UPS services
- Real API keys are required for Stripe and PayPal integration
- Redis must be running for rate limiting and caching to work

## 🏗️ Architecture

```
src/
├── server.js              # Main Express application
├── config/
│   └── redis.js          # Redis client configuration
├── middleware/
│   ├── rateLimiter.js    # Rate limiting middleware
│   ├── cache.js          # Caching middleware
│   └── errorHandler.js   # Error handling middleware
├── routes/
│   ├── payments.js       # Payment endpoints
│   ├── shipping.js       # Shipping endpoints
│   ├── crm.js           # CRM endpoints
│   └── notifications.js  # Notification endpoints
├── services/
│   ├── stripe.js        # Stripe API integration
│   ├── paypal.js        # PayPal API integration
│   ├── fedex.js         # FedEx API integration
│   └── ups.js           # UPS API integration
└── utils/
    └── logger.js        # Winston logger configuration
```
