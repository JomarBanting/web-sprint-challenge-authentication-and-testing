/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/
const User = require("../jokes/users-joke-model")
const { JWT_SECRET } = require("../secrets/index");
const jwt = require("jsonwebtoken");

async function restrict(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next({
          status: 401,
          message: "token invalid"
        })
      } else {
        req.decodedJwt = decoded,
          next();
      }
    })
  } else {
    next({
      status: 401,
      message: "token required"
    })
  }
}

async function checkUserAndPassword(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await User.findBy({ "username": username })
    if (result.length && password.length) {
      req.user = result[0]
      next();
    } else if (!username.length || !password.length) {
      next({
        status: 401,
        message: "username and password required"
      })
    }
    else {
      next({
        status: 401,
        message: "invalid credentials"
      })
    }
  } catch (err) {
    next({
      status: 401,
      message: "username and password required"
    })
  }
}

const checkUsernameExist = async (req, res, next) => {
  try {
    const {username} = req.body;
    const user = await User.findBy({username})
    if(user){
      next({
        status: 401,
        message: "username taken"
      });
    } else {
      req.user = user
      next()
    }
  }catch(err){
    next({
      status: 401,
      message: "username and password required"
    })
  }
}

module.exports = {
  restrict,
  checkUserAndPassword,
  checkUsernameExist
};
