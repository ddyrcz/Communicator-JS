var socket = io.connect();

$(document).ready(() => {	
	//socket.on('message', (message) => {
	//	$('#messages').append($('<li>').text(message));
	//});

	$('#send-form').submit(() => {
		socket.emit('message', $('#send-message').val());
		$('#send-message').val('');
		return false;
	});
});