var express = require('express')
var app = express()

// ### CORS ###
const cors = require('cors')
app.use(cors({
    exposedHeaders: 'Authorization'
}))

// ### BODY PARSER ###
const BodyParser = require('body-parser')
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

// ### Hello World! ###
app.get('/hello-world', function (req, res) {
    return res.json({
        message: 'hello world'
    })
})

// ### API ###
app.use('/api/auth', require('./api/auth'))
app.use('/api/user', require('./api/user'))
app.use('/api/countries', require('./api/countries'))
app.use('/api/cities', require('./api/cities'))
app.use('/api/places', require('./api/places'))
app.use('/api/photos', require('./api/photos'))
app.use('/api/bookings', require('./api/bookings'))

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log('Express server listening on port 3000')
})
