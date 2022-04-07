var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const sequelize = require('./models').sequelize;

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

(async ()=>{
  await sequelize.authenticate();
  console.log('Connection to the database successful!');
  await sequelize.sync();
})();

// catch 404 and renders the error page
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).render('page-not-found',{err:err});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err.status,err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err});
});



module.exports = app;
