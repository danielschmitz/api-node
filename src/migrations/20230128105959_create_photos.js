
const fs = require('fs')


const photos = [
    { name: 'Photo 1', place_id: 1, photo: fs.readFileSync('./images/01.png') },
    { name: 'Photo 2', place_id: 1, photo: fs.readFileSync('./images/02.png') },
    { name: 'Photo 3', place_id: 2, photo: fs.readFileSync('./images/03.png') },
    { name: 'Photo 4', place_id: 2, photo: fs.readFileSync('./images/04.png') },
    { name: 'Photo 5', place_id: 3, photo: fs.readFileSync('./images/05.png') },
]

exports.up = function (knex) {
    return knex.schema.createTable('photos', table => {
        table.increments('id').primary()
        table.varchar('name', 80).notNullable()
        table.binary('photo')
        table
            .integer('place_id')
            .unsigned()
            .references('id')
            .inTable('places')
    }).then(() => knex('photos').insert(photos))
}


exports.down = function (knex) {
    return knex.schema.dropTable('photos')
}