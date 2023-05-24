const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { generateToken } = require('../utils/auth');

const myResolvers = {
  Query: {
    getMe: async (parent, args, context) => {
      if (context.myUser) {
        const userData = await User.findOne({ _id: context.myUser._id });
        console.log(userData);
        return userData;
      }
      throw new AuthenticationError('User is not logged in!');
    },
  },
  Mutation: {
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = generateToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);

      if (!user) {
        throw new AuthenticationError('Something went wrong. User creation failed.');
      }

      const token = generateToken(user);
      return { token, user };
    },

    saveBook: async (parent, { book }, context) => {
      console.log(context.myUser);

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.myUser._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true },
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new AuthenticationError('Something went wrong.');
      }
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.myUser) {
        return User.findOneAndUpdate(
          { _id: context.myUser._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true },
        );
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = myResolvers;
