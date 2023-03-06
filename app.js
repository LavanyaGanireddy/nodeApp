const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
var fs = require('fs');
const cors = require('cors');
const connectDB = require('./server/database/connection');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userRouter = require('./server/routes/userRouter');
const eventRouter = require('./server/routes/eventRouter');
const imageRouter = require('./server/routes/imageRouter');
const donationRouter = require('./server/routes/donationRouter');
// const { notFound, errorHandler } = require('./server/middlewares/errorMiddleware');

const PORT = process.env.PORT || 3001;

const app = express();

connectDB();
dotenv.config();

app.use(bodyparser.urlencoded({ extended: true }));

// app.use(notFound);
// app.use(errorHandler);

app.use(cors({
  credentials: true,
  origin: '*',
  optionsSuccessStatus: 200,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/image', imageRouter)
app.use('/donation', donationRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
