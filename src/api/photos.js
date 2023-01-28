const express = require('express')
const router = express.Router()
const db = require('../db')
const multer = require('multer')
const upload = multer()

const validateFields = (req, res, next) => {
    const { name, place_id } = req.body
    if (!name || !place_id) {
        res.status(400).json({ error: 'Missing required fields' })
    } else {
        next()
    }
}

router.post('', upload.single('photo'), validateFields, async (req, res) => {
    try {
        // insert photo into database
        const { name, place_id } = req.body
        const photo = req.file.buffer
        const inserted = await db('photos').insert({ name, place_id, photo })
        res.status(201).json({ id: inserted[0] })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const photo = await db('photos')
            .where({ id })
            .select(['name', 'place_id', 'photo'])
            .first()
        if (!photo) {
            res.status(404).json({ error: 'Photo not found' })
        } else {
            res.status(200).json(photo)
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.put('/:id', upload.single('photo'), validateFields, async (req, res) => {
    try {
        // update photo in the database
        const { id } = req.params
        const { name, place_id } = req.body
        let photo = null
        if (req.file) {
            photo = req.file.buffer
        }
        const count = await db('photos').where({ id }).update({ name, place_id, photo })
        if (count === 0) {
            res.status(404).json({ error: 'Photo not found' })
        } else {
            res.status(200).json({})
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        // delete photo from the database
        const { id } = req.params
        const count = await db('photos').where({ id }).del()
        if (count === 0) {
            res.status(404).json({ error: 'Photo not found' })
        } else {
            res.status(204).json({})
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router
