const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const {restrict} = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const session = require("express-session")
const Store = require("connect-session-knex")(session)

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(session({
    name: "cookie monster",
    secret: `secret`,
    saveUninitialized: false,
    resave: false,
    store: new Store({
      knex: require("../data/dbConfig"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 10
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true,
    },
  }))

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
      message: err.message,
    });
  });

module.exports = server;
