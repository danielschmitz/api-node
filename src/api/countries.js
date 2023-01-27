const express = require('express')
const db = require('../db')
const StatusCodes = require('../StatusCodes')
const router = express.Router()

// GET all countries
router.get('/', (req, res) => {
    db.select().from('countries')
        .then(data => res.json(data))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


// GET one country by id
router.get('/:id', (req, res) => {
    db('countries').where({ id: req.params.id }).first()
        .then(data => res.json(data))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


// GET all cities of one country by country id
router.get('/:id/cities', (req, res) => {
    db.select().from('cities').where({ country_id: req.params.id })
        .then(data => res.json(data))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})

// POST new country
router.post('/', async (req, res) => {

    //check country name exists
    const country = await db('countries').where({ name: req.body.name }).first()
    if (country) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Country name exists', country })
    }

    db.insert(req.body).into('countries')
        .returning(['id','name','capital','continent'])
        .then(data => res.json(data[0]))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})


router.put('/:id', async (req, res) => {

    //check country name exists
    const country = await db('countries')
        .where({ name: req.body.name })
        .whereNot({ id: req.params.id })
        .first()
    if (country) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Country name exists', country })
    }

    db('countries')
        .where({ id: req.params.id })
        .update(req.body)
        .returning(['id','name','capital','continent'])
        .then(data => res.json(data[0]))
        .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message))
})

module.exports = router