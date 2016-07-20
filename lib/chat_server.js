var socketio = require('socket.io'),
	util = require('util');

var io;
var guestNumber = 0;
var nickUsed = [];
var nickNames = {};
var currentRoom = {};
	
var assignGuestName = function(socket, questNumber, nickNames, nickUsed){	
	questNumber += 1;
	var questName = util.format('Guest%s', questNumber);	
	nickNames[socket.id] = questName;	
	socket.emit('name', questName );	
	nickUsed.push(questName);	
	return questNumber;
}

var joinRoom = function(socket, room, currentRoom){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('room', room);
	socket.broadcast.to(room).emit('message', util.format('%s has joined a room', nickNames[socket.id]));	
}

var handleRoomsRequest = function(socket, io){
	socket.on('rooms', () => {
		socket.emit('rooms', io.sockets.manager.rooms );
	});
}

var handleClientMessage = function(socket, currentRoom, nickNames){	
	
	socket.on('message', function(message){
		socket.broadcast.to(currentRoom[socket.id]).emit('message', util.format('%s: %s', nickNames[socket.id], message));		
		console.log(util.format('%s: %s', nickNames[socket.id], message));
	});
}

var handleNameChangeRequest = function(socket, nickNames, nickUsed, currentRoom){
	socket.on('changeName', (newName) => {
		if(newName.startsWith('Guest')){
			socket.emit('changeName', { success:'false', message:'Name cannot starts with Guest'});
		}else{
			if(nickUsed.indexOf(element) > -1){
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

var handleClientDisconnect = function(socket, nickNames, nickUsed, currentRoom){
	socket.on('disconnect', () => {		
		var name = nickNames[socket.id];
		console.log(util.format('%s left', name));
		var nameIndex = nickUsed.indexOf(name);
		delete nickUsed[nameIndex];
		delete nickNames[socket.id];
		socket.broadcast.to(currentRoom[socket.id]).emit('disconnected', { message:util.format('%s has left', name) });
	});
}
	
var handleRoomChangeRequest = function(socket, currentRoom){
	socket.on('changeRoom', (newRoom) => {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, newRoom, currentRoom);
	});
}

exports.listen = function(server){
	io = socketio.listen(server);	  
	io.sockets.on('connection', function(socket){			
		
		guestNumber = assignGuestName(socket, guestNumber, nickNames, nickUsed);
		
		console.log(util.format('%s joined', nickNames[socket.id]));
		
		joinRoom(socket, 'Lobby', currentRoom);		
		handleRoomsRequest(socket, io);
		handleClientMessage(socket, currentRoom, nickNames);
		handleNameChangeRequest(socket)		
		handleClientDisconnect(socket, nickNames, nickUsed, currentRoom);
		handleRoomChangeRequest(socket, currentRoom);
	});
}