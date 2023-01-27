const express = require('express')
const router = express.Router()
const db = require('../db')


// Validate request body
const validatePlace = (req, res, next) => {
  const { name, address, price, user_id, city_id } = req.body
  if (!name || !address || !price || !user_id || !city_id) {
    return res.status(400).send({ error: 'Missing required fields' })
  }
  next()
}

// Create place
router.post('/', validatePlace, (req, res) => {
  const { name, address, price, user_id, city_id } = req.body
  db.insert({ name, address, price, user_id, city_id }).into('places')
    .then(data => res.json(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Get all places
router.get('/', (req, res) => {
  db.select().from('places')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Get one place by id
router.get('/:id', (req, res) => {
  db.select().from('places').where({ id: req.params.id })
    .then(data => res.send(data[0]))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Update place
router.patch('/:id', validatePlace, (req, res) => {
  const { name, address, price, user_id, city_id } = req.body
  db('places').where({ id: req.params.id }).update({ name, address, price, user_id, city_id })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Delete place
router.delete('/:id', (req, res) => {
  db('places').where({ id: req.params.id }).del()
    .then(() => res.send({ message: 'Place deleted' }))
    .catch(err => res.status(500).send({ error: err.message }))
})

module.exports = router