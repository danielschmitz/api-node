const StatusCodes = require('./StatusCodes')
const jwt = require('jsonwebtoken')


const auth = {

    isLogged: async (req, res, next) => {
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
    },

    hasSameUserId: async (req, res, next) => {

        console.log(1)

        const token = req.headers.authorization
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Authorization header is required' })
        }
        jwt.verify(token, 'JWT_SECRET', function (err, auth) {
            if (err) {
                return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' })
            }

            if (parseInt(auth.id) !== req.body.user_id) {
                return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized User' , id: auth.id, user:  req.body.user_id})
            }

            req.auth = auth
            next()
        })
    }
}

module.exports = auth