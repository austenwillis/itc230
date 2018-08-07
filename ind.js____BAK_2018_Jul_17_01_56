'use strict'
let movies = require("./lib/movies.js");
const express = require("express");
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions

let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

// send static file as response
app.get('/', (req, res) => {
 res.type('text/html');
 res.sendFile(__dirname + '/public/home.html'); 
});

// send plain text response
app.get('/about', (req, res) => {
 res.type('text/plain');
 res.send('About page');
});

app.get('/delete', (req, res) => {
  let deleted = movies.delete(req.query.title); 
  res.render("delete",{title: req.query.title, deleted: deleted});
});



app.post('/get', (req, res) => {
  console.log(req.body);
  let found = movies.get(req.body.title); 
  res.render("details",{title: req.body.title, found: found});
});




// define 404 handler
app.use( (req,res) => {
 res.type('text/plain'); 
 res.status(404);
 res.send('404 - Not found');
});




app.listen(app.get('port'), () => {
 console.log('Express Started'); 
});