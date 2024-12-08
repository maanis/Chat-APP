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
var chatModel = require('./models/textModel')
const userModel = require('./models/userModel');



var indexRouter = require('./routes/index');

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

    socket.broadcast.emit('showOnline', { user_Id: userId });

    socket.on('newChat', (data)=>{
      socket.broadcast.emit('loadChat', data)
    })
    

    socket.on('catchIds', async (data)=>{
      var user = await userModel.findOne({_id: data.reciever_id})
      var chats = await chatModel.find({$or: [
        {senderId: data.sender_id, recieverId: data.reciever_id},
        {senderId: data.reciever_id, recieverId: data.sender_id}
      ]})
      // console.log(chats)
      socket.emit('loadOldChats', chats)
      socket.emit('userInfo', user)
    })


    socket.on('deleteId',async (data)=>{
      console.log(data)
      var chats = await chatModel.findOneAndDelete({
        $or: [
          { senderId: data.sender_id, recieverId: data.reciever_id },
          { senderId: data.reciever_id, recieverId: data.sender_id }
        ],
        _id: data.delete_id // Specify the exact chat to delete
      });
      // await chatModel.findOneAndDelete({_id: data.delete_id})
      console.log('remaining',chats)
    })

 

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
