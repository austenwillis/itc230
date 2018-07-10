var http = require("http"),fs = require('fs'),qs = require("querystring");

var movies = require("./lib/movies.js");


function serveStatic(res, path, contentType, responseCode){
  if(!responseCode) responseCode = 200;
  console.log(__dirname + path)
  fs.readFile(__dirname + path, function(err, data){
      if(err){
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      }
      else{
        res.writeHead(responseCode, {'Content-Type': contentType});
        res.end(data);
      }
  });
}



http.createServer(function(req,res) {
  let url = req.url.split("?"); 
  let query = qs.parse(url[1]);
  let path = url[0].toLowerCase();

  switch(path) {
    case '/':
      serveStatic(res, '/public/home.html', 'text/html');
      break;
    case '/about':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('About page');
      break;
    case '/get':
      let found = movies.get(query.title); // get movies object
      res.writeHead(200, {'Content-Type': 'text/plain'});
      let results = (found) ? JSON.stringify(found) : "Not found";
      res.end('Searching for ' + query.title + ":\n" + results);
      break;
     case '/delete':
     let deleted = movies.delete(query.title); 
      res.writeHead(200, {'Content-Type': 'text/plain'});
      let results2 = (deleted.deleted) ? ' was deleted' : " not deleted";
      res.end('delete \n' + query.title + results2);
      break;
   case '/add':
      let added = movies.add(query.title);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      let results3 = (added.added) ? ' was added' : " not added";
      res.end('add movie \n' + query.title + results3 );
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
      break;
    }
}).listen(process.env.PORT || 3000);