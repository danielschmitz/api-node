

const booking = [
    { start_date: '2022-01-01 10:00:00', end_date: '2022-01-01 12:00:00', place_id: 1, price: 10.0 },
    { start_date: '2022-01-02 14:00:00', end_date: '2022-01-02 16:00:00', place_id: 1, price: 20.0 },
    { start_date: '2022-01-03 18:00:00', end_date: '2022-01-03 20:00:00', place_id: 2, price: 30.0 },
    { start_date: '2022-01-04 10:00:00', end_date: '2022-01-04 12:00:00', place_id: 2, price: 40.0 },
    { start_date: '2022-01-05 14:00:00', end_date: '2022-01-05 16:00:00', place_id: 3, price: 50.0 }   

]

exports.up = function (knex) {
    return knex.schema.createTable('booking', table => {
        table.increments('id').primary()
        table.datetime('start_date').notNullable()
        table.datetime('end_date').notNullable()
        table.decimal('price',10,2).notNullable()
        table
            .integer('place_id')
            .unsigned()
            .references('id')
            .inTable('places')
    }).then(() => knex('booking').insert(booking))
}


exports.down = function (knex) {
    return knex.schema.dropTable('booking')
}