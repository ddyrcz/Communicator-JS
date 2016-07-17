var http = require('http'),	
	util = require('util'),
	staticFile = require('./lib/static_file'),
	chatServer = require('./lib/chat_server');

var server = http.createServer(function(req, res){
	console.log(util.format('%s %s', req.method, req.url));	
	
	if(req.method === 'GET'){
		var filePath = 'public' + req.url;	
		staticFile.serveStaticFile(filePath, res);	
	}
});

chatServer.listen(server);

console.log('Server is running');

server.listen(1234);