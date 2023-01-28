const countries = [
  { name: 'United States', capital: 'Washington, D.C.', continent: 'North America' },
  { name: 'Brazil', capital: 'Brasília', continent: 'South America' },
  { name: 'Russia', capital: 'Moscow', continent: 'Europe' },
  { name: 'India', capital: 'New Delhi', continent: 'Asia' },
  { name: 'China', capital: 'Beijing', continent: 'Asia' },
  { name: 'Australia', capital: 'Canberra', continent: 'Australia' },
  { name: 'Canada', capital: 'Ottawa', continent: 'North America' },
  { name: 'Argentina', capital: 'Buenos Aires', continent: 'South America' },
  { name: 'Mexico', capital: 'Mexico City', continent: 'North America' },
  { name: 'Indonesia', capital: 'Jakarta', continent: 'Asia' },
]

const cities = [
  { name: 'New York', country_id: 1 },
  { name: 'Los Angeles', country_id: 1 },
  { name: 'Chicago', country_id: 1 },
  { name: 'São Paulo', country_id: 2 },
  { name: 'Rio de Janeiro', country_id: 2 },
  { name: 'Belo Horizonte', country_id: 2 },
  { name: 'Moscow', country_id: 3 },
  { name: 'Saint Petersburg', country_id: 3 },
  { name: 'Novosibirsk', country_id: 3 },
  { name: 'New Delhi', country_id: 4 },
  { name: 'Mumbai', country_id: 4 },
  { name: 'Bangalore', country_id: 4 },
  { name: 'Beijing', country_id: 5 },
  { name: 'Shanghai', country_id: 5 },
  { name: 'Guangzhou', country_id: 5 },
  // ... add more cities as needed
]

exports.up = function(knex) {
  return knex.schema
    .createTable('countries', table => {
      table.increments('id')
      table.string('name')
      table.string('capital')
      table.string('continent')
    })
    .createTable('cities', table => {
      table.increments('id')
      table.string('name')
      table
        .integer('country_id')
        .unsigned()
        .references('id')
        .inTable('countries')
        .onDelete('CASCADE')
    })
    .then(() => knex('countries').insert(countries))
    .then(() => knex('cities').insert(cities))
}

exports.down = function(knex) {
  return knex.schema.dropTable('cities').dropTable('countries')
}