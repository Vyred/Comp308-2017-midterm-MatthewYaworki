/*
MidTerm
Matthew Yaworski 300804964
https://comp308w2017-300804964-midterm.herokuapp.com/books

edits:
passport/authorization
requireAuth Function
add require auth and displayName to all routing functions
*/


// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

// define the book model
let book = require('../models/books');

// function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged index
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET books List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', requireAuth, (req, res, next) => {
 res.render('books/details', {
      title: 'Add a new Book',
      displayName: req.user ? req.user.displayName : '',
      books: ''
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', requireAuth, (req, res, next) => {
     book.create({
      "Title": req.body.title,
      "Description": req.body.description,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre" : req.body.genre

    }, (err, book) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/books');
      }
    });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {

  let id = req.params.id;

  // find the game to edit by it's id in the games collection
  book.findById(id, (err, books) => {

    if (err) {
      console.error(err);
      res.end(error);
    }
    else {
      // show the edit view
      res.render('books/details', {
        title: 'Book Details',
        books: books
      });

    }

  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

    // get a reference to the id of the game to edit
  let id = req.params.id;

  // create a new games object to hold the changes
  let books = new book({
    "_id": id,
    "Title": req.body.title,
    "Description" : req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre" : req.body.genre
  });

  book.update({ _id: id}, books, (err) => {
    if(err) {
      console.log(err);
      res.end(error);
    }
    else {
      // refresh the games list
      res.redirect('/books');
    }
  });


});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
 // get a reference to the id of the game to edit
  let id = req.params.id;

  book.remove({_id: id}, (err) => {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/books');
    }
  });

});


module.exports = router;
