var http = require('http'),
	staticFile = require('./lib/static_file'),
	chatServer = require('./lib/chat_server');

var server = http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`);

	if (req.method === 'GET') {
		var filePath = manageFilePath(req.url);
		staticFile.serveStaticFile(filePath, res);
	}
});

var manageFilePath = function (url) {
	if (url === '/') {
		return 'public/index.html';
	} else {
		return 'public' + req.url;
	}
}

chatServer.listen(server);

console.log('Server is running');

server.listen(8000);