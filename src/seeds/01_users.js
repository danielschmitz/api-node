
const bcrypt = require('bcrypt')
const password = '123456'
const hash = bcrypt.hashSync(password, 10)

exports.seed = function (knex, _Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'user1', email: 'user1@email.com', password: hash, ishost: false },
        { name: 'user2', email: 'user2@email.com', password: hash, ishost: false },
        { name: 'user3', email: 'user3@email.com', password: hash, ishost: false },
        { name: 'host1', email: 'host1@email.com', password: hash, ishost: true },
        { name: 'host2', email: 'host2@email.com', password: hash, ishost: true },
        { name: 'host3', email: 'user3@email.com', password: hash, ishost: true }
      ])
    })
}