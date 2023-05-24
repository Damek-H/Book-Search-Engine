const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { myTypeDefs, myResolvers } = require('./mySchemas');
const myDatabase = require('./myDatabase');

const { myAuthMiddleware } = require('./myUtils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs: myTypeDefs,
  resolvers: myResolvers,
  context: myAuthMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const startMyApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  myDatabase.once('open', () => {
    app.listen(PORT, () => {
      console.log(`My API server is running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`,
      );
    });
  });
};

startMyApolloServer();
