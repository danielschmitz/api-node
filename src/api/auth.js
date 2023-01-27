const express = require('express')
const router = express.Router()
const db = require('../db')
const StatusCodes = require('../StatusCodes')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const checkLogin = require('../checkLogin')

router.get('/hello-world', function (req, res) {
    return res.json({ message: 'hello world from /api/auth' })
})

router.post('/login', async function (req, res) {
    const { email, password } = req.body
    const user = await db('users').where({ email }).first()
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found with that email' })
    }
    const validatePassword = await bcrypt.compare(password, user.password)
    if (!validatePassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Incorrect password' })
    }
    const token = jsonwebtoken.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            ishost: user.ishost
        },
        'JWT_SECRET', // dont use this in production
        {
            expiresIn: '1y'
        }
    )
    return res.status(StatusCodes.OK).send(token)
})

router.get('/checklogin', checkLogin, async function (req, res) { 
    return res.status(StatusCodes.OK).json({
        token_info: req.auth
    })
})


module.exports = router