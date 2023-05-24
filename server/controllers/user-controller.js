const { MyUser } = require('../myModels');
const { mySignToken } = require('../myUtils/myAuth');

module.exports = {
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await MyUser.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },
  async createUser({ body }, res) {
    const user = await MyUser.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = mySignToken(user);
    res.json({ token, user });
  },

  async login({ body }, res) {
    const user = await MyUser.findOne({ $or: [{ username: body.username }, { email: body.email }] });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }
    const token = mySignToken(user);
    res.json({ token, user });
  },

  async saveBook({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await MyUser.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { mySavedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  async deleteBook({ user, params }, res) {
    const updatedUser = await MyUser.findOneAndUpdate(
      { _id: user._id },
      { $pull: { mySavedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
};
