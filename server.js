var http = require('http'),	
	util = require('util'),
	staticFile = require('./lib/static');

var server = http.createServer(function(req, res){
	console.log(util.format('%s %s', req.method, req.url));	
	
	if(req.method === 'GET'){
		var filePath = 'public' + req.url;	
		staticFile.serveStaticFile(filePath, res);	
	}
});

server.listen(1234);