const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');
const fetch = require('node-fetch');
var ObjectID = require('bson-objectid');
const { TypeComposer, schemaComposer } = require('graphql-compose');
const { graphqlUploadExpress } = require('graphql-upload');
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');
const mongoose = require('mongoose');
const { rootMutation } = require('./graphql/rootMutation');
const { rootQuery } = require('./graphql/rootQuery');
const { Category } = require('./model');
const { ApolloServer, gql } = require('apollo-server-express');
const { scrappingProduct } = require('./utils/scrapingProduct');
const bodyParser = require('body-parser');
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
require('./model');
const http = require('http');

const jsonServer = (path) => `http://localhost:4000${path && path}`;
const dbString =
  'mongodb+srv://daniil:xK&AMb9E8CmzWM037F@cluster0.t9qys.mongodb.net/kugooStoreDbCopy?retryWrites=true&w=majority';

const corsOptions = {
  origin: '*',
  credentials: true,
};

const root = {
  Upload: GraphQLUpload,
  Mutation: {
    ...rootMutation,
  },

  Query: {
    ...rootQuery,
  },
};

async function start(app, httpServer) {
  const server = new ApolloServer({
    cors: corsOptions,
    uploads: false,
    typeDefs: schema,
    resolvers: root,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
  await server.start();

  app.use(graphqlUploadExpress({ maxFileSize: 10486000, maxFiles: 20 }));
  server.applyMiddleware({ app });
  app.listen(5000, async () => {
    try {
      await mongoose.connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', () => {
        console.log('Error Mongoose DB');
      });
      console.log('server started on port 5000');
    } catch (error) {
      console.log('[ERR] ', error);
    }
  });
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('static'));
app.use('/static', express.static('static'));

const httpServer = http.createServer(app);

start(app, httpServer);

module.exports = httpServer;
