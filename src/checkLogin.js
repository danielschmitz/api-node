const StatusCodes = require('./StatusCodes')
const jwt = require('jsonwebtoken')

const checkLogin = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Authorization header is required' })
    }
    jwt.verify(token, 'JWT_SECRET', function (err, auth) {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' })
        } else {
            req.auth = auth
            next()
        }
    })
}

module.exports = checkLogin