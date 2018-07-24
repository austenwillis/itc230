'use strict'

const express = require("express");
const app = express();

var Movie =require("./models/Movie");
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/views')); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions

let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

// // send static file as response
// app.get('/', (req, res) => {
//  res.type('text/html');
//  res.sendFile(__dirname + '/public/home.html'); 
// });



app.get('/', (req,res) => {
    Movie.find((err,movies) => {
        if (err) return next(err);
        res.render('home', {movies: movies });    
    });
});

// send plain text response
app.get('/about', (req, res) => {
 res.type('text/plain');
 res.send('About page');
});

app.get('/delete', (req,res) => {
    Movie.remove({ title:req.query.title }, (err, deleted) => {
        if (err) return next(err);
       // let deleted = result.result.n !== 0; // n will be 0 if no docs deleted
        Movie.count((err, total) => {
            res.type('text/html');
            res.render('delete', {title: req.query.title, deleted: deleted, total: total } );    
        });
    });
});

app.get('/get', (req,res) => {
    Movie.findOne({ title:req.query.title }, (err, movie) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {found: movie} ); 
    });
});

app.post('/get', (req,res) => {
    Movie.findOne({ title:req.body.title }, (err, movies) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {found: movies} ); 
    });
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