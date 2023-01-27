const bcrypt = require('bcrypt')
const password = '123456'
const hash = bcrypt.hashSync(password, 10)

const users = [
    { name: 'user1', email: 'user1@email.com', password: hash, ishost: false },
    { name: 'user2', email: 'user2@email.com', password: hash, ishost: false },
    { name: 'user3', email: 'user3@email.com', password: hash, ishost: false },
    { name: 'host1', email: 'host1@email.com', password: hash, ishost: true },
    { name: 'host2', email: 'host2@email.com', password: hash, ishost: true },
    { name: 'host3', email: 'user3@email.com', password: hash, ishost: true }
]

exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name', 80).notNullable()
        table.string('email', 80).notNullable()
        table.string('password', 80).notNullable()
        table.boolean('ishost').defaultTo(false)
    }).then(() => knex('users').insert(users))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users')
}