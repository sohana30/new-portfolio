# API Projects - Working Implementations

This directory contains **4 fully functional API projects** demonstrating backend development and API integration expertise.

## 📁 Projects Overview

### 1. REST API Integration Hub
**Location:** `rest-api-integration/`

Enterprise-grade REST API integration platform connecting multiple third-party services.

**Tech Stack:** Node.js, Express, Redis, Axios  
**Features:**
- Payment processing (Stripe, PayPal)
- Shipping integration (FedEx, UPS)
- Rate limiting with token bucket algorithm
- Redis caching with automatic TTL
- Comprehensive error handling

[📖 Implementation Guide](./rest-api-integration/IMPLEMENTATION.md)

---

### 2. GraphQL API Gateway
**Location:** `graphql-gateway/`

GraphQL gateway using Apollo Federation to compose multiple microservices.

**Tech Stack:** GraphQL, Apollo Server, DataLoader  
**Features:**
- Apollo Federation for distributed schemas
- DataLoader batching (80% query reduction)
- Cross-service type extensions
- Authentication token forwarding
- Real-time schema composition

[📖 Implementation Guide](./graphql-gateway/IMPLEMENTATION.md)

---

### 3. Microservices API Orchestration
**Location:** `microservices-orchestration/`

Event-driven microservices architecture with saga patterns.

**Tech Stack:** Node.js, RabbitMQ, Express  
**Features:**
- Choreography-based saga pattern
- Event-driven communication
- Automatic compensation on failures
- RabbitMQ topic exchange
- Distributed transaction management

[📖 Implementation Guide](./microservices-orchestration/IMPLEMENTATION.md)

---

### 4. API Security Gateway
**Location:** `api-security-gateway/`

Security-focused API gateway with OAuth2 and JWT authentication.

**Tech Stack:** Node.js, JWT, Redis, Bcrypt  
**Features:**
- JWT authentication (RS256)
- Access & refresh tokens
- Token revocation with Redis
- Multi-tier rate limiting
- Security headers with Helmet.js

[📖 Implementation Guide](./api-security-gateway/IMPLEMENTATION.md)

---

## 🚀 Quick Start Guide

### Prerequisites

All projects require:
- **Node.js 16+**
- **Redis** (for caching and rate limiting)

Additional requirements:
- **RabbitMQ** (for microservices project)
- **API Keys** (optional, for third-party integrations)

### Installation

Each project can be run independently:

```bash
# Navigate to any project
cd rest-api-integration/
# or cd graphql-gateway/
# or cd microservices-orchestration/
# or cd api-security-gateway/

# Install dependencies
npm install

# Run the project
npm start
```

## 📊 Project Comparison

| Feature | REST Integration | GraphQL Gateway | Microservices | Security Gateway |
|---------|-----------------|-----------------|---------------|------------------|
| **Port** | 3000 | 4000 | 3001-3003 | 4000 |
| **Architecture** | Monolithic | Federated | Distributed | Gateway |
| **Communication** | HTTP/REST | GraphQL | Events | HTTP/JWT |
| **State Management** | Stateless | Stateless | Event Sourcing | Token-based |
| **Scalability** | Vertical | Horizontal | Horizontal | Horizontal |

## 🔧 Common Setup

### Start Redis (Docker)

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

### Start RabbitMQ (Docker)

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

## 📝 Testing the Projects

### 1. REST API Integration

```bash
# Start server
cd rest-api-integration && npm start

# Test payment endpoint
curl -X POST http://localhost:3000/api/payments/stripe/charge \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"usd","source":"tok_visa"}'
```

### 2. GraphQL Gateway

```bash
# Start services
cd graphql-gateway
node src/services/users.js &    # Terminal 1
node src/services/products.js & # Terminal 2
node src/server.js              # Terminal 3

# Open GraphQL Playground
open http://localhost:4000
```

### 3. Microservices Orchestration

```bash
# Start RabbitMQ first
docker start rabbitmq

# Start all services
cd microservices-orchestration && npm run start:all

# Create an order
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user123","items":[{"productId":"prod1"}],"total":99.99}'
```

### 4. API Security Gateway

```bash
# Start server
cd api-security-gateway && npm start

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token to access protected endpoint
curl http://localhost:4000/api/data \
  -H "Authorization: Bearer {token}"
```

## 🎯 Learning Outcomes

These projects demonstrate:

✅ **RESTful API Design** - Resource-based endpoints, HTTP methods  
✅ **GraphQL** - Schema design, federation, resolvers  
✅ **Event-Driven Architecture** - Pub/sub patterns, saga orchestration  
✅ **Authentication & Authorization** - OAuth2, JWT, token management  
✅ **Rate Limiting** - Token bucket, sliding window algorithms  
✅ **Caching Strategies** - Redis, TTL, cache invalidation  
✅ **Error Handling** - Centralized handlers, logging  
✅ **Microservices Patterns** - Service discovery, circuit breakers  
✅ **Security Best Practices** - Encryption, headers, input validation  
✅ **API Integration** - Third-party services, webhooks  

## 📚 Additional Resources

- [REST API Best Practices](https://restfulapi.net/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## 🤝 Contributing

These are portfolio demonstration projects. Feel free to:
- Fork and modify for your own learning
- Submit issues for bugs or improvements
- Use as reference for your own projects

## 📄 License

MIT License - See individual project LICENSE files

---

**Built with ❤️ by Sohana**  
*Showcasing backend development and API integration expertise*
