var http = require('http'),
	fs = require('fs');

var serveStaticFile = function(filePath, res){	
	fs.readFile(filePath, (err, data) => {
		if(err){
			res.end('404');
		}else{
			res.end(data);
		}
	});
}
	
var server = http.createServer(function(req, res){
	var filePath = 'public' + req.url;	
	serveStaticFile(filePath, res);	
});

server.listen(1234);