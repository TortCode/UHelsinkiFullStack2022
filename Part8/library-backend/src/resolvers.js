const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    me: async (root, args, context) => context.currentUser,
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (root, args) => {
      let query = Book.find();

      if (args.author != null) {
        query = query.where({ author: args.author })
      }
      if (args.genre != null) {
        query = query.where({ genres: args.genre })
      }

      const result = await query.populate('author')
      return result
    },
    allAuthors: async () => await Author.find({}),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        }
      }

      const book = new Book({ ...args })
      book.author = author._id
      try {
        await book.save()
        author.bookCount += 1
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', {
        bookAdded: populatedBook
      })

      return populatedBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      let author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      try {
        author.born = args.setBornTo
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const signingUser = {
        username: user.username,
        id: user._id
      }

      const token = jwt.sign(signingUser, process.env.JWT_SECRET)
      return { value: token }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  },
}

module.exports = resolvers