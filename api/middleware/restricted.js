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
    const { username, password } = req.body;
    const user = await User.findBy({ username })
    if (!user.length && password.length) {
      next();
    } else if (user.length) {
      next({
        status: 401,
        message: "username taken"
      })
    } else {
      next({
        status: 401,
        message: "username and password required"
      })
    }
  } catch (err) {
    next({
      status: 401,
      message: "username and password required"
    })
  }
}

async function checkUserIdExist(req, res, next) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400).json({
      message: "Invalid User ID"
    })
  } else {
    next()
  }
}

module.exports = {
  restrict,
  checkUserAndPassword,
  checkUsernameExist,
  checkUserIdExist
};
