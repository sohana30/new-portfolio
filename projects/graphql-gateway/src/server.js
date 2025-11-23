const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const { readFileSync } = require('fs');
const { createServer } = require('http');

// Subgraph URLs
const subgraphs = [
    { name: 'users', url: 'http://localhost:4001/graphql' },
    { name: 'products', url: 'http://localhost:4002/graphql' },
    { name: 'orders', url: 'http://localhost:4003/graphql' },
    { name: 'reviews', url: 'http://localhost:4004/graphql' }
];

async function startGateway() {
    const gateway = new ApolloGateway({
        supergraphSdl: new IntrospectAndCompose({
            subgraphs
        }),
        buildService({ url }) {
            return new (require('@apollo/gateway').RemoteGraphQLDataSource)({
                url,
                willSendRequest({ request, context }) {
                    // Forward authentication headers
                    if (context.token) {
                        request.http.headers.set('authorization', context.token);
                    }
                }
            });
        }
    });

    const server = new ApolloServer({
        gateway,
        context: async ({ req }) => {
            // Extract token from request
            const token = req.headers.authorization || '';
            return { token };
        },
        plugins: [
            {
                async requestDidStart() {
                    return {
                        async didEncounterErrors(requestContext) {
                            console.error('GraphQL Errors:', requestContext.errors);
                        }
                    };
                }
            }
        ]
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }) => ({
            token: req.headers.authorization || ''
        })
    });

    console.log(`🚀 GraphQL Gateway ready at ${url}`);
    console.log(`📊 Federated subgraphs: ${subgraphs.map(s => s.name).join(', ')}`);
}

startGateway().catch(console.error);
