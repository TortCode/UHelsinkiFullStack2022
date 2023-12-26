const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const express = require('express')
const cors = require('cors')
const { createServer } = require('http')

require('dotenv').config()

const mongoose = require('mongoose')
const User = require('./models/user')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const jwt = require('jsonwebtoken')


const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((e) => {
    console.log('error connecting to MongoDB:', e.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const start = async () => {
  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring('Bearer '.length), process.env.JWT_SECRET)
          const user = await User.findById(decodedToken.id)
          return { currentUser: user }
        }
        return null
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
  })
}

start()
