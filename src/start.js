import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {prepare} from "../util/index"


const app = express()

app.use(cors())

const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = 'mongodb://localhost:27017/minerals'



export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    const Minerals = db.collection('minerals')

    const typeDefs = [`
      type Query {
        minerals(limit: Int, offset: Int): [Mineral]
      }

      type Mineral {
        _id: String
        name: String
        content: String
      }

      type Mutation {
        createMineral(name: String, content: String): Mineral
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `];

    const resolvers = {
      Query: {
        minerals: async (root, {limit, offset}) => {
          return (await Minerals.find({})
              .limit(parseInt(limit))
              .skip(parseInt(offset))
             .toArray()).map(prepare)
        },
      },
      Mutation: {
        createMineral: async (root, args, context, info) => {
          const res = await Minerals.insertOne(args)
          return prepare(res.ops[0])
        }
      },
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })


    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))


    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath} to make minerals and explore them.`)
    })

  } catch (e) {
    console.log(e)
  }

}
