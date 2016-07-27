class Chat {
    constructor(socket) {
        this.socket = socket;
    }

    manageUserInput() {
        var message = $('#send-message').val()
        $('#messages').append($('<div id=\'myMessage\'></div>').text('me: ' + message));
        socket.emit('message', message);
        $('#send-message').val('');
    }

    initHandlers() {
        socket.on('message', (message) => {
            $('#messages').append($('<div></div>').text(message));
        });

        socket.on('name', (name) => {

        });

        socket.on('room', (currentRoom) => {
            $('#room').text(currentRoom);
        });

        socket.on('rooms', (rooms) => {
            $('#room-list').text(rooms);
        });
    }
}

setInterval(() => { socket.emit('rooms') }, 1000);