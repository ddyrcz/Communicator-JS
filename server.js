var http = require('http'),
	fs = require('fs'),
	mime = require('mime'),
	path = require('path');

var serveStaticFile = function(filePath, res){	
	fs.readFile(filePath, (err, data) => {
		if(err){
			notFound(res);
		}else{
			sendFile(res, filePath, data);
		}
	});
}
	
var notFound = function(res){
	res.statusCode = 404;
	res.end('404 not found');
}

var sendFile = function(res, filePath, data){
	res.writeHead(200, {"content-type":mime.lookup(path.basename(filePath))});
	res.end(data);	
}
	
var server = http.createServer(function(req, res){
	var filePath = 'public' + req.url;	
	serveStaticFile(filePath, res);	
});

server.listen(1234);