const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');
const DataLoader = require('dataloader');

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    description: String
    category: String!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    favoriteProducts: [Product!]!
  }

  type Query {
    product(id: ID!): Product
    products(category: String, limit: Int = 10): [Product!]!
  }
`;

const products = [
    { id: '1', name: 'Laptop', price: 999.99, description: 'High-performance laptop', category: 'Electronics' },
    { id: '2', name: 'Mouse', price: 29.99, description: 'Wireless mouse', category: 'Electronics' },
    { id: '3', name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard', category: 'Electronics' }
];

const userFavorites = {
    '1': ['1', '2'],
    '2': ['3']
};

const createProductLoader = () => new DataLoader(async (ids) => {
    console.log('Batching product IDs:', ids);
    return ids.map(id => products.find(p => p.id === id));
});

const resolvers = {
    Query: {
        product: async (_, { id }, { productLoader }) => {
            return productLoader.load(id);
        },
        products: async (_, { category, limit }) => {
            let filtered = products;
            if (category) {
                filtered = products.filter(p => p.category === category);
            }
            return filtered.slice(0, limit);
        }
    },
    User: {
        favoriteProducts: async (user, _, { productLoader }) => {
            const favoriteIds = userFavorites[user.id] || [];
            return productLoader.loadMany(favoriteIds);
        }
    },
    Product: {
        __resolveReference: async (reference, { productLoader }) => {
            return productLoader.load(reference.id);
        }
    }
};

async function startProductService() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context: () => ({
            productLoader: createProductLoader()
        })
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4002 }
    });

    console.log(`📦 Product service ready at ${url}`);
}

startProductService().catch(console.error);
