'use strict'

const express = require("express");
const app = express();

var Movie =require("./models/Movie");
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/views')); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions
app.use('/api', require("cors")());

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
        res.render('home', {movies: JSON.stringify(movies)});    
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
//api

app.get('/api/v1/movie/:title', (req, res, next) => {
    let title = req.params.title;
    console.log(title);
    Movie.findOne({title: title}, (err, found) => {
        if (err || !found) return next(err);
        res.json( found );    
    });
});

app.get('/api/v1/movies', (req,res, next) => {
    Movie.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});



app.get('/api/v1/delete/:id', (req,res, next) => {
    Movie.remove({"_id":req.params.id }, (err, found) => {
        if (err) return next(err);
        // return # of items deleted
        res.json({"deleted": found.result});
    });
});

app.post('/api/v1/add/', (req,res, next) => {
    // find & update existing item, or add new 
    if (!req.body._id) { // insert new document
        let movie = new Movie({title:req.body.title,director:req.body.director,price:req.body.price});
        movie.save((err,newMovie) => {
            if (err) return next(err);
            console.log(newMovie)
            res.json({updated: 0, _id: newMovie._id});
        });
    } else { // update existing document
        Movie.updateOne({ _id: req.body._id}, {title:req.body.title, director: req.body.director, price: req.body.price }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
});


app.get('/api/v1/add/:title/:director/:price', (req,res, next) => {
    // find & update existing item, or add new 
    let title = req.params.title;
    Movie.update({ title: title}, {title:title, director: req.params.director, price: req.params.price }, {upsert: true }, (err, result) => {
        if (err) return next(err);
        // nModified = 0 for new item, = 1+ for updated item 
        res.json({updated: result.nModified});
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