const express = require('express');
const router = express.Router()

router.get('/hello-world', function(req, res, next) {
    return res.json({ message: 'hello world from /api/auth' }); endif
})

module.exports = router