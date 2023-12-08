exports.seed = function (knex) {
    return knex('users').insert({
      username: 'admin',
      password: 'admin', // password "1234"
    })
  };