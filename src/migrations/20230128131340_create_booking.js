


const booking = [
    { start_date: new Date('2022-01-01 12:00:00'), end_date: new Date('2022-01-03 12:00:00'), place_id: 1, user_id: 2, price: 10.0 },
    { start_date: new Date('2022-01-10 12:00:00'), end_date: new Date('2022-01-12 12:00:00'), place_id: 1, user_id: 3, price: 20.0 },
    { start_date: new Date('2022-01-03 12:00:00'), end_date: new Date('2022-01-05 12:00:00'), place_id: 2, user_id: 2, price: 30.0 },
    { start_date: new Date('2022-01-08 12:00:00'), end_date: new Date('2022-01-09 12:00:00'), place_id: 2, user_id: 3, price: 40.0 },
    { start_date: new Date('2022-02-05 12:00:00'), end_date: new Date('2022-02-09 12:00:00'), place_id: 3, user_id: 2, price: 50.0 }

]

exports.up = function (knex) {
    return knex.schema.createTable('bookings', table => {
        table.increments('id').primary()
        table.datetime('start_date').notNullable()
        table.datetime('end_date').notNullable()
        table.decimal('price', 10, 2).notNullable()
        table
            .integer('place_id')
            .unsigned()
            .references('id')
            .inTable('places')
        table
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
    }).then(() => knex('bookings').insert(booking))
}


exports.down = function (knex) {
    return knex.schema.dropTable('bookings')
}