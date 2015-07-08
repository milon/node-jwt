module.exports = function(app, express, jwt, User){
	var apiRoutes = express.Router();

	apiRoutes.post('/authenticate', function(request, response){
		console.log(request.body);
		User.findOne({
			name: request.body.name
		}, function(error, user){
			if(error){
				throw error;
			}

			if(! user){
				response.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			}
			else if(user){
				if(user.password != request.body.password){
					response.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				}
				else{
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInMinutes: 1440
					});

					response.json({
						success: true,
						message: 'Token Created',
						token: token
					});
				}
			}

		});
	});

	apiRoutes.use(function(request, response, next){
		var token = request.body.token || request.query.token || request.headers['x-access-token'];

		if(token){
			jwt.verify(token, app.get('superSecret'), function(error, decoded){
				if(error){
					return response.json({
						success: false,
						message: 'Failed to authenticate token'
					});
				}
				else{
					request.decoded = decoded;
					next();
				}
			});
		}
		else{
			return response.status(403).send({
				success: false,
				message: 'No token provided'
			});
		}

	});

	apiRoutes.get('/', function(request, response){
		response.json({
			success: true,
			message: 'Welcome to our API'
		});
	});

	apiRoutes.get('/users', function(request, response){
		User.find({}, function(error, users){
			response.json(users);
		});
	});

	return apiRoutes;
};
