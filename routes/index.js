var path = require('path');

module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: 'Group Chat'});
	});
	var messages = [];
	var count = 0;
	app.io.route('got_new_user', function(req){
		messages.push(req.data.name + ' has joined the conversation');
		req.session.name = req.data.name;
		req.io.broadcast('new_user', messages[count]);
		req.io.emit('exisiting_users', messages);
		count++;
	});
	app.io.route('new_message', function(req){
		messages.push(req.session.name+' : '+req.data.message);
		app.io.broadcast('chat_update', messages[count]);
		count++;
	});
	app.io.route('disconnect', function(req){
		messages.push(req.session.name+' has left the conversation');
		req.io.broadcast('disconnected_user', messages[count]);
		count++;
	})
}