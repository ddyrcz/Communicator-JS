var socketio = require('socket.io')

var io;
var guestNumber = 0;
var nickUsed = [];
var nickNames = {};
var currentRoom = {};
	
var assignGuestName = function(socket, questNumber, nickNames, nickUsed){	
	questNumber += 1;
	var questName = `Guest${questNumber}`;	
	nickNames[socket.id] = questName;	
	socket.emit('name', questName );	
	nickUsed.push(questName);	
	return questNumber;
}

var joinRoom = function(socket, room, currentRoom, nickNames){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('room', room);
	socket.broadcast.to(room).emit('message', `${nickNames[socket.id]} has joined a room`);	
}

var handleRoomsRequest = function(socket, io){
	socket.on('rooms', () => {
		socket.emit('rooms', io.sockets.manager.rooms );
	});
}

var handleClientMessage = function(socket, currentRoom, nickNames){	
	
	socket.on('message', function(message){
		socket.broadcast.to(currentRoom[socket.id]).emit('message', `${nickNames[socket.id]}: ${message}`);				
		console.log(`${nickNames[socket.id]}: ${message}`);
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
				
				socket.broadcast.to(currentRoom[socket.id]).emit('changeName', { success:'true', message: `${oldName} has changed name to ${newName}`});
			}			
		}
	});
}

var handleClientDisconnect = function(socket, nickNames, nickUsed, currentRoom){
	socket.on('disconnect', () => {		
		var name = nickNames[socket.id];
		console.log(`${name} left`);
		var nameIndex = nickUsed.indexOf(name);
		delete nickUsed[nameIndex];
		delete nickNames[socket.id];
		socket.broadcast.to(currentRoom[socket.id]).emit('disconnected', { message: `${name} has left` });
	});
}
	
var handleRoomChangeRequest = function(socket, currentRoom, nickNames){
	socket.on('changeRoom', (newRoom) => {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, newRoom, currentRoom, nickNames);
	});
}

exports.listen = function(server){
	io = socketio.listen(server);	  
	io.sockets.on('connection', function(socket){			
		
		guestNumber = assignGuestName(socket, guestNumber, nickNames, nickUsed);
		
		console.log(`${nickNames[socket.id]} joined`);
		
		joinRoom(socket, 'Lobby', currentRoom, nickNames);		
		handleRoomsRequest(socket, io);
		handleClientMessage(socket, currentRoom, nickNames);
		handleNameChangeRequest(socket)		
		handleClientDisconnect(socket, nickNames, nickUsed, currentRoom);
		handleRoomChangeRequest(socket, currentRoom, nickNames);
	});
}