const express = require('express')
const auth = require('../auth')
const db = require('../db')
const StatusCodes = require('../StatusCodes')
const router = express.Router()

// GET all cities
router.get('/', (req, res) => {
    db.select(['cities.*', 'countries.name as country_name']).from('cities')
        .join('countries', 'countries.id', '=', 'cities.country_id')
        .then(data => res.json(data))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


// GET one city by id
router.get('/:id', (req, res) => {
    db('cities').select(['cities.*', 'countries.name as country_name'])
        .join('countries', 'countries.id', '=', 'cities.country_id')
        .where({ 'cities.id': req.params.id }).first()
        .then(data => res.json(data))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


// POST new city
router.post('/', auth.isLogged, async (req, res) => {

    //check city name exists
    const city = await db('cities')
        .where({ name: req.body.name })
        .first()
    if (city) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'city name exists', city })
    }

    if (!req.body.country_id) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'country_id is required' })
    }

    db.insert(req.body).into('cities')
        .returning(['id', 'name', 'country_id'])
        .then(data => res.status(StatusCodes.CREATED).json(data[0]))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


router.put('/:id', auth.isLogged, async (req, res) => {

    if (!req.body.country_id) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'country_id is required' })
    }

    //check city name exists
    const city = await db('cities')
        .where({ name: req.body.name })
        .whereNot({ id: req.params.id })
        .first()
    if (city) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'city name exists', city })
    }

    db('cities')
        .where({ id: req.params.id })
        .update(req.body)
        .returning(['id', 'name', 'country_id'])
        .then(data => res.json(data[0]))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})

module.exports = router