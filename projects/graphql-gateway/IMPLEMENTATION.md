# GraphQL API Gateway - Implementation

This is the **actual working implementation** of the GraphQL API Gateway with Apollo Federation.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed

### Installation

```bash
npm install
```

### Running the Services

You need to start the subgraph services first, then the gateway:

```bash
# Terminal 1 - User Service
node src/services/users.js

# Terminal 2 - Product Service  
node src/services/products.js

# Terminal 3 - Gateway
node src/server.js
```

The gateway will be available at `http://localhost:4000`

## 🎯 GraphQL Playground

Open `http://localhost:4000` in your browser to access Apollo Studio.

### Example Queries

#### Get User with Favorite Products (Federation)
```graphql
query {
  user(id: "1") {
    id
    name
    email
    favoriteProducts {
      id
      name
      price
    }
  }
}
```

#### Get Products by Category
```graphql
query {
  products(category: "Electronics", limit: 5) {
    id
    name
    price
    description
  }
}
```

#### Create New User
```graphql
mutation {
  createUser(email: "new@example.com", name: "New User") {
    id
    email
    name
    createdAt
  }
}
```

## 🔧 Features Implemented

✅ **Apollo Federation** - Distributed schema composition  
✅ **DataLoader Batching** - Automatic query batching to reduce N+1 queries  
✅ **Type Extensions** - Cross-service type relationships  
✅ **Authentication Context** - Token forwarding between services  
✅ **Error Handling** - Centralized error logging  

## 📊 DataLoader Benefits

The DataLoader implementation batches multiple requests:

```javascript
// Without DataLoader - 3 separate queries
user(id: "1") { favoriteProducts { name } }  // Query 1
user(id: "2") { favoriteProducts { name } }  // Query 2  
user(id: "3") { favoriteProducts { name } }  // Query 3

// With DataLoader - 1 batched query
// Batching product IDs: ['1', '2', '3']
```

## 🏗️ Architecture

```
src/
├── server.js              # Apollo Gateway
└── services/
    ├── users.js          # User subgraph
    ├── products.js       # Product subgraph
    ├── orders.js         # Order subgraph (placeholder)
    └── reviews.js        # Review subgraph (placeholder)
```

### Subgraph Ports
- Gateway: `4000`
- Users: `4001`
- Products: `4002`
- Orders: `4003` (not implemented)
- Reviews: `4004` (not implemented)

## 🧪 Testing Federation

Test cross-service queries to see federation in action:

```graphql
# This query spans two services (users + products)
query {
  users(limit: 2) {
    name
    favoriteProducts {  # Resolved by products service
      name
      price
    }
  }
}
```

## 📝 Adding New Subgraphs

1. Create a new service file in `src/services/`
2. Define schema with `@key` directives for entities
3. Use `extend type` to add fields to entities from other services
4. Add the subgraph URL to `server.js`
5. Restart the gateway

## 🔐 Authentication

The gateway forwards authentication tokens to subgraphs:

```javascript
// In gateway request
headers: {
  'authorization': 'Bearer token123'
}

// Forwarded to all subgraphs automatically
```
