const express = require('express')
const auth = require('../auth')
const db = require('../db')
const router = express.Router()


const validateBooking = (req, res, next) => {
    const { place_id, start_date, end_date, price, user_id } = req.body
    if (!place_id || !start_date || !end_date || !price || !user_id) {
        return res.status(400).send({ error: 'Missing required fields' })
    }
    next()
}

router.get('/place/:id', (req, res) => {
    return db('bookings')
        .where({ place_id: req.params.id })
        .returning('*')
        .then(data => {

            const result = data.map(booking => {
                const start_date_string = new Date(booking.start_date).toLocaleString()
                const end_date_string = new Date(booking.end_date).toLocaleString()
                return {...booking, start_date_string, end_date_string}
            })
            res.status(200).json(result)
        })
        .catch(err => res.status(500).send({ error: err.message }))
})


router.get('/:id', (req, res) => {
    return db('bookings')
        .where({ id: req.params.id })
        .first()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ error: err.message }))
})

router.post('/', [validateBooking, auth.isLogged], (req, res) => {
    const { place_id, start_date, end_date, price, user_id } = req.body
    db('booking')
        .insert({ place_id, start_date, end_date, price, user_id })
        .returning('*')
        .then(data => res.status(201).json(data[0]))
        .catch(err => res.status(500).send({ error: err.message }))
})

router.put('/:id', [validateBooking, auth.isLogged], (req, res) => {
    const { place_id, start_date, end_date, price, user_id } = req.body

    db('photos')
        .where({ id: req.params.id })
        .update({ place_id, start_date, end_date, price, user_id })
        .returning('*')
        .then(data => res.json(data))
        .catch(err => res.status(500).send({ error: err.message }))
})

router.delete('/:id', auth.isLogged, (req, res) => {
    db('bookings').where({ id: req.params.id }).del()
        .then(() => res.status(200).json({ message: 'Booking deleted' }))
        .catch(err => res.status(500).send({ error: err.message }))
})

router.post('/check/:place_id', (req, res) => {
    const day = new Date(req.body.day)
    const { place_id } = req.params
    db('bookings')
        .where({ place_id })
        .where('start_date', '<=', day)
        .where('end_date', '>=', day)
        .first()
        .then(data => {
            if (data) {
                return res.status(200).json(data)
            }
            return res.status(404).json(
                {
                    message: 'not found',
                    day,place_id,data})
        })
        .catch(err => res.status(500).send({ error: err.message }))
})













module.exports = router