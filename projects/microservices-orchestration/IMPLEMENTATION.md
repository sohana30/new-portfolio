# Microservices API Orchestration - Implementation

This is the **actual working implementation** of the event-driven microservices architecture with saga patterns.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- RabbitMQ server running (Docker recommended)

### Start RabbitMQ with Docker

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

Access RabbitMQ Management UI at `http://localhost:15672` (guest/guest)

### Installation

```bash
npm install
```

### Running the Services

```bash
# Start all services concurrently
npm run start:all

# Or start individually:
npm run start:order      # Port 3001
npm run start:payment    # Port 3002
npm run start:inventory  # Port 3003
```

## 📡 Testing the Saga Pattern

### Create an Order (Triggers Saga)

```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user123",
    "items": [
      { "productId": "prod1", "quantity": 2 }
    ],
    "total": 99.99
  }'
```

### Watch the Event Flow

1. **OrderCreated** event published by Order Service
2. **PaymentService** receives event and processes payment
3. If payment succeeds → **PaymentCompleted** event
4. If payment fails → **PaymentFailed** event
5. Order Service updates order status accordingly
6. On failure → **CancelInventoryReservation** compensation event

### Check Order Status

```bash
curl http://localhost:3001/orders/{orderId}
```

## 🔧 Features Implemented

✅ **Event-Driven Architecture** - RabbitMQ topic exchange  
✅ **Saga Pattern** - Choreography-based distributed transactions  
✅ **Compensation Logic** - Automatic rollback on failures  
✅ **Event Sourcing** - Complete event history  
✅ **Automatic Reconnection** - Resilient RabbitMQ connections  
✅ **Idempotency** - Event deduplication with unique IDs  

## 📊 Event Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /orders
       ▼
┌─────────────────┐
│ Order Service   │──► OrderCreated Event
└─────────────────┘
       │
       ▼
┌─────────────────┐
│   RabbitMQ      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ Payment │ │Inventory │
│ Service │ │ Service  │
└────┬────┘ └──────────┘
     │
     ├─► PaymentCompleted (Success)
     └─► PaymentFailed (Failure)
         │
         └─► CancelInventoryReservation
```

## 🧪 Testing Failure Scenarios

The Payment Service has a built-in 20% failure rate to demonstrate compensation:

```javascript
// In payment-service/index.js
const success = Math.random() > 0.2; // 80% success rate
```

Create multiple orders to see both success and failure paths.

## 📝 Event Types

- `OrderCreated` - New order placed
- `PaymentCompleted` - Payment successful
- `PaymentFailed` - Payment failed
- `CancelInventoryReservation` - Compensation event

## 🏗️ Architecture

```
services/
├── order-service/
│   └── index.js          # Order management + saga orchestration
├── payment-service/
│   └── index.js          # Payment processing
└── inventory-service/
    └── index.js          # Inventory management (placeholder)

shared/
├── eventBus.js           # RabbitMQ wrapper
└── logger.js             # Winston logger
```

## 🔐 Environment Variables

```bash
RABBITMQ_URL=amqp://localhost
ORDER_SERVICE_PORT=3001
PAYMENT_SERVICE_PORT=3002
INVENTORY_SERVICE_PORT=3003
```

## 📊 Monitoring Events

Watch RabbitMQ Management UI to see:
- Exchange: `microservices_events`
- Routing keys: Event types
- Message flow in real-time

## 🚀 Scaling

Each service can be scaled independently:

```bash
# Run multiple instances
PORT=3001 npm run start:order
PORT=3011 npm run start:order  # Second instance
```

RabbitMQ will load-balance events across instances.
