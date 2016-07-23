var socket = io.connect();
var chat = new Chat(socket);

$(document).ready(() => {

	chat.initHandlers();

	$('#send-form').submit(() => {
		chat.manageUserInput();
		return false;
	});
});