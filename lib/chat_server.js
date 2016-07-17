var socketio = require('socket.io'),
	util = require('util');

var io;
var guestNumber = 0;
var nickUsed = [];
var nickNames = {};
var currentRoom = {};
	
var assignGuestName = function(socket, questNumber, nickNames, usedNames){	
	questNumber += 1;
	var questName = util.format('Guest%s', questNumber);	
	nickNames[socket.id] = questName;	
	socket.emit('name', { name:questName });	
	usedNames.push(questName);	
	return questNumber;
}

var joinRoom = function(socket, room, currentRoom){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('room', {'room':room});
	socket.broadcast.to(room).emit(message, {message:util.format('&s has joined a room', nickNames[socket.id])});	
}

var handleRoomsRequest = function(socket, io){
	socket.on('rooms', () => {
		socket.emit('rooms', { 'rooms':io.sockets.manager.rooms });
	});
}

var handleClientMessage = function(socket, nickNames){
	socket.on('message', function(message){
		socket.broadcast.to(currentRoom[socket.id]).emit('message', {message:util.format('%s: %s', nickNames[socket.id], message)});
	});
}

var handleNameChangeRequest = function(socket, nickNames, nickUsed, currentRoom){
	socket.on('changeName', (newName) => {
		if(newName.startsWith('Guest')){
			socket.emit('changeName', { success:'false', message:'Name cannot starts with Guest'});
		}else{
			if(nickUsed.contains(newName)){
				socket.emit('changeName', { success:'false', message:'Name is in use'});
			}else{
				var oldName = nickNames[socket.id];
				var oldNameIndex = nickUsed.indexOf(oldName);
				nickNames[socket.id] = newName;	
				nickUsed.push(newName);
				delete nickUsed[oldNameIndex];
				
				socket.broadcast.to(currentRoom[socket.id]).emit('changeName', { success:'true', message:util.format('%s has changed name to %s', oldName, newName)});
			}			
		}
	});
}

var handleClientDisconnect = function(socket, nickNames, usedNames, currentRoom){
	socket.on('disconnect', () => {
		var name = nickNames[socket.id];
		var nameIndex = usedNames.indexOf(name);
		delete usedNames[nameIndex];
		delete nickNames[socket.id];
		socket.broadcast.to(currentRoom[socket.id]).emit('disconnected', { message:util.format('%s has left', name) });
	});
}
	
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};	
	
exports.listen = function(server){
	io = socketio.listen(server);	
	io.sockets.on('connection', function(socket){
		console.log(util.format('socket log: %s', 'connection accepted'));			
		questNumber = assignGuestName(socket, questNumber, nickNames, usedNames);
		joinRoom(socket, 'Lobby', currentRoom);
		handleRoomsRequest(socket, io);
		handleClientMessage(socket);
		handleNameChangeRequest(socket)		
		handleClientDisconnect(socket, nickNames, usedNames, currentRoom);
	});
}