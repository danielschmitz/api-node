var express = require('express');
var app = express()

app.get('/hello-world', function(req, res, next) {
    return res.json({
        mensagem: "hello world"
    });
})

app.listen(3000, function() {
    console.log('Express server listening on port 3000');
})



