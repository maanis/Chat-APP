require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var mongooseConnection = require('./config/mongoose-config')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
const cors = require('cors');



var indexRouter = require('./routes/index');
const userModel = require('./models/userModel');

var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// app.use(cors());
app.use(flash());

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var usp = io.of('/chat');

usp.on('connection', async (socket) => {
    console.log('User connected');

    var userId = socket.handshake.auth.token;
    console.log('Received userId from handshake:', userId); // Add this log to confirm it's received

    await userModel.findOneAndUpdate({ _id: userId }, { is_active: true });

    usp.emit('showOnline', { user_Id: userId });

    socket.on('disconnect', async () => {
        console.log('User disconnected');
        await userModel.findOneAndUpdate({ _id: userId }, { is_active: false });
        socket.broadcast.emit('showOffline', { user_Id: userId });
    });
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

module.exports = { app, server };
