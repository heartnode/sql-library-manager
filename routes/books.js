var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

router.get('/',asyncHandler(async (req,res)=>{
    const books = await Book.findAll();
    console.log(books);
    res.render('books/index', {title:"Books", books});
}));

/**
 * Shows the create new book form
 */
 router.get('/new',asyncHandler(async (req,res)=>{
    res.render('books/new', {book:{}, title: "New Book"})
}));

/**
 * Post a new Book in the database
 */
router.post('/new',asyncHandler(async (req,res)=>{
    let book;
    try{
        book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error){
        if (error.name === 'SequelizeValidationError'){
            book = await Book.build(req.body);
            res.render("books/new",{book, errors:error.errors, title: "New Book"});
        }
    }
}));

router.get('/:id',asyncHandler(async(req,res,next)=>{
    const book = await Book.findByPk(req.params.id);
    if (book){
        res.render('books/detail',{title:"Update Book", book});
    } else {
        next();
    }
}));

/**
 * Updates book info in the database
 */
router.post('/:id',asyncHandler(async (req,res,next)=>{
    let book;
    try{
        book = await Book.findByPk(req.params.id);
        if (book){
            await book.update(req.body);
            res.redirect("/books");
        } else {
            /*
            const error = new Error('Not Found');
            res.render('page-not-found',{error});
            */
           next();
        }
        
    } catch (error){
        if (error.name === 'SequelizeValidationError'){
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("books/detail", {book, errors: error.errors, title: "Update Book"});
        } else{
            throw error;
        }
    }
}));

router.post('/:id/delete', asyncHandler(async (req,res)=>{   
    const book = await Book.findByPk(req.params.id);
    if (book){
        await book.destroy();
        res.redirect('/books');
    } else {
        res.sendStatus(404);
    }
}));




module.exports = router;