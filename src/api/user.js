const express = require('express')

const db = require('../db')
const StatusCodes = require('../StatusCodes')
const router = express.Router()
const bcrypt = require('bcrypt')
const auth = require('../auth')

router.get('/:id', auth.isLogged, async function (req, res) {
    const { id } = req.params
    if (req.auth.id !== id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
    const user = await db('users').where({ id }).first()
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found with that id' })
    }
    return res.status(StatusCodes.OK).json({
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'User email exists' })
    }
    //create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await db('users')
        .insert({ name, email, password: hashedPassword, ishost })
        .returning(['id', 'name', 'email', 'ishost'])
    return res.status(StatusCodes.CREATED).json(newUser[0])
})

router.put('/:id', auth.isLogged, async function (req, res) {
    const { id } = req.params
    const { name, email, password, ishost } = req.body

    if (parseInt(req.auth.id) !== parseInt(id)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized User'})
    }

    const checkEmail = await db('users')
        .where({ email }).whereNot({ id })
        .first()

    if (checkEmail) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'User email exists' })
    }

    const user = await db('users')
        .where({ id })
        .update({ name, email, password, ishost })
        .returning(['id', 'name', 'email', 'ishost'])

    return res.status(StatusCodes.OK).json(user[0])

})

module.exports = router