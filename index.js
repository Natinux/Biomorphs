var express     = require('express');
var http        = require('http');
var nodemailer  = require('nodemailer');
var app         = express();
var dbPath      = 'mongodb://localhost/biomorphs';
var bodyParser = require('body-parser');


// Create an http server
app.server = http.createServer(app);


// Import the data layer
var mongoose = require('mongoose');
var config = {
    mail: require('./config/mail')
};

// Import the models
var models = {
    Generation: require('./models/Generation')(app, config, mongoose, nodemailer)
};

// Configuring the app
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());


mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
});


// Import the routes
require('./routes/generation')(app, models);

app.server.listen(8080);
console.log("Biomorphs is listening to port 8080.");