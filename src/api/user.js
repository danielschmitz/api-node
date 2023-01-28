const express = require('express')

const db = require('../db')
const router = express.Router()
const bcrypt = require('bcrypt')
const auth = require('../auth')

router.get('/:id', auth.isLogged, async function (req, res) {
    const { id } = req.params
    if (req.auth.id !== id) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const user = await db('users').where({ id }).first()
    if (!user) {
        return res.status(404).json({ message: 'No user found with that id' })
    }
    return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        ishost: user.ishost
    })
})

router.post('/', async function (req, res) {
    const { name, email, password, ishost } = req.body
    const user = await db('users').where({ email }).first()
    if (user) {
        return res.status(500).json({ message: 'User email exists' })
    }
    //create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await db('users')
        .insert({ name, email, password: hashedPassword, ishost })
        .returning(['id', 'name', 'email', 'ishost'])
    return res.status(201).json(newUser[0])
})

router.put('/:id', auth.isLogged, async function (req, res) {
    const { id } = req.params
    const { name, email, password, ishost } = req.body

    if (parseInt(req.auth.id) !== parseInt(id)) {
        return res.status(401).json({ message: 'Unauthorized User'})
    }

    const checkEmail = await db('users')
        .where({ email }).whereNot({ id })
        .first()

    if (checkEmail) {
        return res.status(500).json({ message: 'User email exists' })
    }

    const user = await db('users')
        .where({ id })
        .update({ name, email, password, ishost })
        .returning(['id', 'name', 'email', 'ishost'])

    return res.status(200).json(user[0])

})

module.exports = router