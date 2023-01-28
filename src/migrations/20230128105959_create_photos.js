
const img_src = [
    'https://media.architecturaldigest.com/photos/6295627e63eca0af32f7c750/master/w_1920%2Cc_limit/8daeb070-e9f1-40f1-a0c2-fb906824.jpg',
    'https://media.architecturaldigest.com/photos/5a317e6c38bb817b7ffe1bdc/master/w_1920%2Cc_limit/Airbnb%2520Alaska.png',
    'https://media.architecturaldigest.com/photos/5a302964cf0d6c31eb82eb9e/master/w_1920%2Cc_limit/Airbnb_Arizona3.jpg',
    'https://media.architecturaldigest.com/photos/5a3029c7cf0d6c31eb82eba4/master/w_1920%2Cc_limit/Airbnb_Arkansas.jpg',
    'https://media.architecturaldigest.com/photos/5a3029cacf0d6c31eb82eba6/master/w_1920%2Cc_limit/Airbnb_California.jpg'
]


const photos = [
    { name: 'Photo 1', place_id: 1, photo: img_src[0] },
    { name: 'Photo 2', place_id: 1, photo: img_src[1] },
    { name: 'Photo 3', place_id: 2, photo: img_src[2] },
    { name: 'Photo 4', place_id: 3, photo: img_src[3] },
    { name: 'Photo 5', place_id: 3, photo: img_src[4] }
]

exports.up = function (knex) {
    return knex.schema.createTable('photos', table => {
        table.increments('id').primary()
        table.string('name', 80).notNullable()
        table.string('photo')
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