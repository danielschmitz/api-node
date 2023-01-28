const express = require('express')
const db = require('../db')
const router = express.Router()


// Validate request body
const validatePhoto = (req, res, next) => {
    const { name, photo, place_id } = req.body
    if (!name || !photo || !place_id) {
        return res.status(400).send({ error: 'Missing required fields' })
    }
    next()
}

// Create photo
router.post('/', [validatePhoto], (req, res) => {
    const { name, photo, place_id } = req.body
    db('photos')
        .insert({ name, photo, place_id })
        .returning('*')
        .then(data => res.status(201).json(data[0]))
        .catch(err => res.status(500).send({ error: err.message }))
})

// Get all photos
router.get('/:id', (req, res) => {
    const place_id = req.params.id
    db.select().from('photos').where({ place_id })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).send({ error: err.message }))
})

// Get one photo by id
router.get('/:idplace/:idphoto', (req, res) => {
    db.select()
        .from('photos').where({ id: req.params.idphoto, place_id: req.params.idplace })
        .first()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ error: err.message }))
})

// Update photo
router.put('/:id', [validatePhoto], (req, res) => {
    const { name, photo, place_id } = req.body
    db('photos')
        .where({ id: req.params.id })
        .update({ name, photo, place_id })
        .returning('*')
        .then(data => res.json(data))
        .catch(err => res.status(500).send({ error: err.message }))
})

// Delete photo
router.delete('/:id', (req, res) => {
    db('photos').where({ id: req.params.id }).del()
        .then(() => res.status(200).json({ message: 'Photo deleted' }))
        .catch(err => res.status(500).send({ error: err.message }))
})

module.exports = router