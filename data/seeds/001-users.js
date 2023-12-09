exports.seed = function (knex, Promise) {
  return knex('users')
    .truncate()
    .then(function () {
      return knex('users').insert({
        username: 'admin',
        password: '$2a$08$CjOzAqkUXePlNyZCG6TKuubIY.MpjKqOdrV/W3178ah483kyEbeSe', // password "1234"
      });
    });
};