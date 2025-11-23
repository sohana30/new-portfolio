# GraphQL API Gateway

## Overview
Unified GraphQL gateway that aggregates 8 microservices using Apollo Federation, providing a type-safe, performant data layer with automatic query optimization.

## Features
- **Apollo Federation**: Distributed schema composition across subgraphs
- **DataLoader Batching**: 80% reduction in database queries
- **Type Safety**: Full TypeScript implementation
- **Query Complexity Analysis**: Prevents expensive queries
- **Real-time Subscriptions**: WebSocket-based live updates
- **Field-level Authorization**: Granular permissions with custom directives
- **Persisted Queries**: APQ for reduced bandwidth

## Tech Stack
- **Framework**: Apollo Server, GraphQL
- **Language**: TypeScript, Node.js
- **Cache**: Redis
- **Orchestration**: Kubernetes
- **Monitoring**: Apollo Studio
- **Testing**: Jest, GraphQL Testing Library

## Architecture
```
Client Applications
        ↓
Apollo Gateway (Schema Composition)
        ↓
┌───────────────────────────────────┐
│  Federated Subgraph Services      │
├───────────────────────────────────┤
│ • User Service                    │
│ • Product Catalog                 │
│ • Order Management                │
│ • Analytics Service               │
│ • Notification Service            │
│ • Payment Service                 │
│ • Inventory Service               │
│ • Review Service                  │
└───────────────────────────────────┘
        ↓
DataLoader (Batching & Caching)
        ↓
Database Layer
```

## Key Metrics
- **8** microservices integrated
- **80%** fewer database queries
- **5K+** queries per minute
- **<30ms** P95 latency

## Installation
```bash
npm install
npm run build
npm run start:gateway
```

## Schema Example
```graphql
# Query multiple services in one request
query GetUserWithOrders {
  user(id: "123") {
    id
    name
    email
    # From Order Service
    orders {
      id
      total
      # From Product Service
      items {
        product {
          name
          price
        }
      }
    }
    # From Analytics Service
    stats {
      totalSpent
      orderCount
    }
  }
}
```

## DataLoader Implementation
```typescript
// Automatic batching prevents N+1 queries
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
});

// Usage in resolver
const resolvers = {
  Order: {
    customer: (order, _, { loaders }) => 
      loaders.userLoader.load(order.customerId)
  }
};
```

## Federation Schema
```graphql
# User Service
type User @key(fields: "id") {
  id: ID!
  email: String!
  name: String!
}

# Order Service extends User
extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}
```

## Query Complexity
```typescript
// Prevent expensive queries
const complexityPlugin = {
  validationRules: [
    createComplexityLimitRule(1000, {
      scalarCost: 1,
      objectCost: 2,
      listFactor: 10
    })
  ]
};
```

## Subscriptions
```graphql
subscription OnOrderUpdate {
  orderUpdated {
    id
    status
    updatedAt
  }
}
```

## Testing
```bash
npm test                    # Run all tests
npm run test:integration    # Integration tests
npm run test:schema         # Schema validation
npm run test:performance    # Load testing
```

## Performance Optimizations
1. **DataLoader batching** - Reduces DB queries by 80%
2. **Response caching** - Redis with TTL-based invalidation
3. **Persisted queries** - APQ reduces payload by 90%
4. **Connection pooling** - Optimized DB connections
5. **Lazy loading** - Defer expensive fields

## Monitoring
- Apollo Studio for query analytics
- Custom metrics in Prometheus
- Distributed tracing with Jaeger
- Error tracking with Sentry

## License
MIT
