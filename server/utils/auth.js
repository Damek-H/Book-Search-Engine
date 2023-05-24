const mySecret = 'mysecretsdonttellanyone';
const myExpiration = '2h';

module.exports = {
  authenticate: function ({ req }) {
    let myToken = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      myToken = myToken.split(' ').pop().trim();
    }

    if (!myToken) {
      return req;
    }

    try {
      const { data } = jwt.verify(myToken, mySecret, { maxAge: myExpiration });
      req.myUser = data;
    } catch {
      console.log('Invalid token');
      return req;
    }

    return req;
  },
  generateToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, mySecret, { expiresIn: myExpiration });
  },
};
