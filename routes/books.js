var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {Op} = require('../models').Sequelize;
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

router.get('/',asyncHandler(async (req,res,next)=>{
    const page = (parseInt(req.query.page) >= 1) ? parseInt(req.query.page)  : 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit;
    const url = '/books?limit=' + limit;

    const {count, rows} = await Book.findAndCountAll({
        offset,
        limit
    });
    //When no search results show 404
    if (rows.length === 0){
        next();
        return;
    }

    const numOfPages = Math.ceil(count / limit);

    res.render('books/index', {title:"Books", books:rows,url,currentPage:page, numOfPages});
}));

/**
 * Shows the create new book form
 */
 router.get('/new',asyncHandler(async (req,res)=>{
    res.render('books/new-book', {book:{}, title: "New Book"})
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
            res.render("books/new-book",{book, errors:error.errors, title: "New Book"});
        }
    }
}));


router.get('/search', asyncHandler(async(req,res,next)=>{
    const query = '%'+ req.query.query + '%';
    const page = (parseInt(req.query.page) >= 1) ? parseInt(req.query.page)  : 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit;
    const url = '/books/search?query=' + req.query.query + '&limit=' + limit;

    const {count, rows} = await Book.findAndCountAll({
        where:{
            [Op.or]:[
                {title:{[Op.like]: query}},
                {author:{[Op.like]: query}},
                {genre:{[Op.like]: query}},
                {year:{[Op.like]: query}}
            ]
        } ,
        offset: offset,
        limit: limit
    });
    const numOfPages = Math.ceil(count / limit);

    res.render('books/index', {books:rows, currentPage:page, numOfPages,url,title:"Books with " + req.query.query});
}));
/**
 * Search books in the database
 */
router.post('/search', asyncHandler(async(req,res)=>{
    const query = '%' + req.body.query+ '%';
    let books;
    books = await Book.findAll({
        where:{
            [Op.or]:[
                {
                    title:{
                        [Op.like]: query
                    }
                },
                {
                    author:{
                        [Op.like]: query
                    }
                },
                {
                    genre:{
                        [Op.like]: query
                    }
                },
                {
                    year:{
                        [Op.like]: query
                    }
                }
            ]
        }
    });
    res.render('books/index', {books, title:"Books with " + req.body.query});
}));
router.get('/:id',asyncHandler(async(req,res,next)=>{
    const book = await Book.findByPk(req.params.id);
    if (book){
        res.render('books/update-book',{title:"Update Book", book});
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
            res.render("books/update-book", {book, errors: error.errors, title: "Update Book"});
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