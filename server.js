//require node modules
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');

//require local modules
var config     = require('./config');
var User       = require('./app/models/user');

//configuration
var port = process.env.PROT || 8000;

mongoose.connect(config.database);
app.set('superSecret', config.secret);

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use morgan to log request to console
app.use(morgan('dev'));

//routes
app.get('/', function(request, response){
	response.send('Api is at "http://localhost:' + port +'" url.');
});

app.get('/setup', function(request, response){
	//create a new user
	var milon = new User({
		name: 'Sadek',
		password: 'weDevs',
		admin: false
	});

	milon.save(function(error){
		if(error){
			throw error;
		}

		console.log('User successfully saved.');
		response.json({ success: true });
	});
});

//api routes
var apiRoutes = require('./app/apiroutes')(app, express, jwt, User);
app.use('/api', apiRoutes);

//listening to port
app.listen(port, function(){
	console.log('Listening to port: ' + port);
});