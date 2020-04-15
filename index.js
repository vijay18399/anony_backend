var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var config = require("./config/config");
var Message = require("./models/message");
var User = require("./models/user");
var cors = require("cors");
var app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

connection.on("error", err => {
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running. " + err
  );
  process.exit();
});

let server = require("http").createServer(app);
let io = require("socket.io")(server);

io.on("connection", socket => {

  socket.on("typing", data => {
    console.log(data);
    io.emit("typing", data);
  });
  socket.on("ntyping", data => {
    console.log(data);
    io.emit("ntyping", data);
  });
  socket.on("signup", data => {
    io.emit("new_user", data);
  });
  socket.on("send-message", message => {
    console.log(message);
    console.log(typeof message);
    message.createdAt = new Date();
    let newMessage = Message(message);
    newMessage.save(function(err, data) {
      if (err) {
        console.log(err);
      }
      if (data) {
        channel = message.from + "-" + message.to;
        io.emit(channel, data);
        console.log(data);
      }
    });
  });
  socket.on("seen", message => {
    message['isSeen'] = true;
    Message.updateOne({ _id : { $eq: message._id } }, message, (err, data) => {
      if(data){
        channel = message.from + "-" + message.to;
        io.emit(channel, message);
        console.log(message);
      }
      if (err) {
        console.log(err);
      }
    });
   
  });
  socket.on("sent", message => {
    message['isSent'] = true;
    Message.updateOne({ _id : { $eq: message._id } }, message, (err, data) => {
      if(data){
        channel = message.from + "-" + message.to;
        io.emit(channel, message);
        console.log(message);
      }
      if (err) {
        console.log(err);
      }
    });
   
  });


 
});

var port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log("socket.io listening in http://localhost:" + port);
});
