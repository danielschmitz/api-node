const express = require('express')
const auth = require('../auth')
const db = require('../db')
const router = express.Router()


// Validate request body
const validatePlace = (req, res, next) => {
  const { name, address, price, user_id, city_id } = req.body
  if (!name || !address || !price || !user_id || !city_id) {
    return res.status(400).send({ error: 'Missing required fields' })
  }
  next()
}

// Create place
router.post('/', [validatePlace, auth.isHost], (req, res) => {
  const { name, address, price, city_id } = req.body
  db('places')
    .insert({ name, address, price, user_id: req.auth.id, city_id })
    .returning('*')
    .then(data => res.status(201).json(data[0]))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Get all places
router.get('/', (req, res) => {
  db.select().from('places')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Get all places from logged user
router.get('/user', auth.isHost, (req, res) => {
  const { id } = req.auth
  db.select().from('places')
    .where({ user_id: id })
    .then(data => res.json(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Get one place by id
router.get('/:id', (req, res) => {
  db.select().from('places').where({ id: req.params.id })
    .then(data => res.send(data[0]))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Update place
router.put('/:id', [validatePlace, auth.isHost, auth.hasSameUserId], (req, res) => {
  const { name, address, price, city_id } = req.body
  db('places')
    .where({ id: req.params.id })
    .update({ name, address, price, user_id: req.auth.id, city_id })
    .returning([ 'name', 'address', 'price', 'city_id', 'user_id' ])
    .then(data => res.json(data))
    .catch(err => res.status(500).send({ error: err.message }))
})

// Delete place
router.delete('/:id',auth.hasSameUserId, (req, res) => {
  db('places').where({ id: req.params.id }).del()
    .then(() => res.json({ message: 'Place deleted' }))
    .catch(err => res.status(500).send({ error: err.message }))
})

module.exports = router