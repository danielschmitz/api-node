

const places = [
    { name: 'Place 1', address: 'Address 1', price: 32.87, user_id: 1, city_id: 1 },
    { name: 'Place 2', address: 'Address 2', price: 122.87, user_id: 2, city_id: 5 },
    { name: 'Place 3', address: 'Address 3', price: 212.87, user_id: 1, city_id: 1 },
]

exports.up = function (knex) {
    return knex.schema.createTable('places', table => {
        table.increments('id').primary()
        table.varchar('name', 80).notNullable()
        table.text('address').notNullable()
        table.decimal('price', 10, 2)
        table
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
        table
            .integer('city_id')
            .unsigned()
            .references('id')
            .inTable('cities')
    }).then(() => knex('places').insert(places))
}


exports.down = function (knex) {
    return knex.schema.dropTable('places')
}