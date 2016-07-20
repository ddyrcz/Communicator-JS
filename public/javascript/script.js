var socket = io.connect();

$(document).ready(() => {	
	
	socket.on('message', (message) => {			
		$('#messages').append($('<div></div>').text(message));
	});
	
	socket.on('name', (name) => {
		
	});
	
	socket.on('room', (currentRoom) => {
		$('#room').text(currentRoom);
	});
	
	socket.on('rooms', (rooms) =>{
		
	});
	

	$('#send-form').submit(() => {
		
		var message = $('#send-message').val()
		
		$('#messages').append($('<div id=\'myMessage\'></div>').text('me: ' + message));
		socket.emit('message', message);
		$('#send-message').val('');
		
		return false;
	});
});