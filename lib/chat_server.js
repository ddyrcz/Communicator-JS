var socketio = require('socket.io'),
	util = require('util');

var io;
var guestNumber = 0;
var nickUsed = [];
var nickNames = {};
var currentRoom = {};
	
var assignGuestName = function(socket, questNumber, nickNames, usedNames){	
	var questName = util('Guest%s', questNumber);	
	nickNames[socket.id] = questName;	
	socket.emit('name', { name:questName });	
	usedNames.push(questName);	
	return questNumber;
}

var joinRoom(socket, room, currentRoom){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('room', {'room':room});
	socket.broadcast.to(room).emit(message, {message:util.format('&s has joined a room', nickNames[socket.id])});
	
}
	
exports.listen = function(server){
	io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		console.log(util.format('socket log: %s', 'connection accepted'));	
		guestNumber += 1;
		questNumber = assignGuestName(socket, questNumber, nickNames, usedNames);
		joinRoom(socket, 'Lobby', currentRoom);
		socket.on('rooms', () => {
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		
	});
}