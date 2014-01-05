/**********************/
/***** INITIALIZE *****/
/**********************/

var express = require('express')     // gets express
  , app = express()                  // makes the express app
  // , mongoose = require('mongoose')   // gets mongoose
  , port = process.env.PORT || 3000
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server); // sets the port either to the env var PORT or 3000

/*********************/
/***** CONFIGURE *****/
/*********************/

io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
   io.set('log level', 1);
});

// general purpose configurations
app.configure(function() {
  app.set('view engine', 'jade');         // use jade
  app.set('views', __dirname + '/views'); // tell express to look in the views directory
  app.use(express.bodyParser());          // uses express's body parser to parse through url encoded vars
});

// only development configurations
app.configure('development', function() {
  app.use(express.errorHandler({ // show detailed errors
    dumpExceptions : true,
    showStack : true
  }));
  // this should be the dev database URL
  // if you're using heroku, they set the env var for you, so you can leave this commented
  // process.env['MONGODB_URL'] = 'mongodb://localhost:27017/basic-node-example-dev';
});

// only production configurations
app.configure('production', function() {
  // put things only for production
  // this should be the prod database URL
  // if you're using heroku, they set the env var for you, so you can leave this commented
  // process.env['MONGODB_URL'] = 'mongodb://localhost:27017/basic-node-example';
});

/******************/
/***** ROUTES *****/
/******************/

// home route
app.get('/', function (req, res) {
  console.log('GET ' + req.url);
  res.render('index');
});

// assets route
app.get('/(*).(css|js)', function (req, res) {
  console.log('GET ' + req.url);
  res.sendfile(__dirname + '/' + req.params[1] + '/' + req.params[0] + '.' + req.params[1]);
});

// fonts route
app.get('/fonts/(*)', function (req, res) {
  console.log('GET ' + req.url);
  res.sendfile(__dirname + '/fonts/' + req.params[0]);
});

// images route
app.get('/images/(*).(jpg|jpeg|png)', function (req, res) {
  console.log('GET ' + req.url);
  res.sendfile(__dirname + '/images/' + req.params[0] + '.' + req.params[1]);
});

/*****************/
/***** MONGO *****/
/*****************/

// connect to the mongodb (either MongoLab's (Heroku Add-on), MongoHQ's (Heroku Add-on), or your own custom Mongo server
// mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGODB_URL);

/******************/
/***** LISTEN *****/
/******************/

// listens for web requests on port 3000
server.listen(port, function() {
  console.log('Listening on port ' + port);
});

io.sockets.on('connection', function(socket) {
  socket.emit('news', { hello: 'world' });

  socket.on('rawData', function (data,fn,session,socket) {
    console.log('WTF3 ', data);
  });

});



