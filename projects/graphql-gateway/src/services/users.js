const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');
const DataLoader = require('dataloader');

// Type definitions
const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users(limit: Int = 10): [User!]!
    me: User
  }

  type Mutation {
    createUser(email: String!, name: String!): User!
    updateUser(id: ID!, name: String): User!
  }
`;

// Mock database
const users = [
    { id: '1', email: 'john@example.com', name: 'John Doe', createdAt: new Date().toISOString() },
    { id: '2', email: 'jane@example.com', name: 'Jane Smith', createdAt: new Date().toISOString() }
];

// DataLoader for batching
const createUserLoader = () => new DataLoader(async (ids) => {
    console.log('Batching user IDs:', ids);
    return ids.map(id => users.find(u => u.id === id));
});

// Resolvers
const resolvers = {
    Query: {
        user: async (_, { id }, { userLoader }) => {
            return userLoader.load(id);
        },
        users: async (_, { limit }) => {
            return users.slice(0, limit);
        },
        me: async (_, __, { userId, userLoader }) => {
            if (!userId) throw new Error('Not authenticated');
            return userLoader.load(userId);
        }
    },
    Mutation: {
        createUser: async (_, { email, name }) => {
            const user = {
                id: String(users.length + 1),
                email,
                name,
                createdAt: new Date().toISOString()
            };
            users.push(user);
            return user;
        },
        updateUser: async (_, { id, name }) => {
            const user = users.find(u => u.id === id);
            if (!user) throw new Error('User not found');
            if (name) user.name = name;
            return user;
        }
    },
    User: {
        __resolveReference: async (reference, { userLoader }) => {
            return userLoader.load(reference.id);
        }
    }
};

async function startUserService() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context: ({ req }) => ({
            userLoader: createUserLoader(),
            userId: req.headers['x-user-id'] || null
        })
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4001 }
    });

    console.log(`👤 User service ready at ${url}`);
}

startUserService().catch(console.error);
