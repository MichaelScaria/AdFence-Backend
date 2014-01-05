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


// make persistent stuff
var featureSum = new Array(); //array[mood][feature]
var featureSum2 = new Array();
var featureNum = new Array();
var featureAvg = new Array();
var featureStd = new Array();
var numFeatures = 28;


var data = new Array();
var dataSize = new Array();

for(var i=0; i<4; i++) {
  data[i] = new Array();
  dataSize[i]=0;
}
for(var i=0; i<3; i++) {
  featureSum[i] = new Array();
  featureSum2[i] = new Array();
  featureNum[i] = new Array();
  featureAvg[i] = new Array();
  featureStd[i] = new Array();
  for(var j=0; j<numFeatures; j++) {
    featureSum[i][j]=0;
    featureSum2[i][j]=0;
    featureNum[i][j]=0;
    featureAvg[i][j]=0;
    featureStd[i][j]=1;
  }
}
sum1=0; num1=0;
sum5=0; num5=0;
sum15=0; num15=0;
sum60=0; num60=0;



io.sockets.on('connection', function(socket) {
  socket.emit('news', { hello: 'world' });

  socket.on('rawData', function (data,fn,session,socket) {
    console.log('test')
    // for(var i=0; i<10000; i+=2) {
    //   getData("6,5");
    //   getData("5,6");
    // }
    // train(0);
    // clearData();
    // for(var i=0; i<10000; i+=2) {
    //   getData("10,11");
    //   getData("11,10");
    // }
    console.log('WTF3 ', data['values']);
    var stringed = data['values'];
    // console.log(stringed)
    getData(stringed)
    train(0);

    var result = query();
    onsole.log('RESULT ' + result);
    socket.emit('result', { hello: data });

  });

});


/*****************/
/**** Helpers ****/
/*****************/

function getData(input) {
  var res = input.split(",");
  for(var i=0; i<res.length; i++) {

    //get new data
    var cur = parseInt(res[i]);
    sum1+=cur; num1++;
    sum5+=cur; num5++;    
    sum15+=cur; num15++;
    sum60+=cur; num60++;

    //reduce quality of data
    if(num1>=1) {
      data[0][dataSize[0]]=sum1/num1; dataSize[0]++; sum1=0; num1=0;
    }
    if(num5>=5) {
      data[1][dataSize[1]]=sum5/num5; dataSize[1]++; sum5=0; num5=0;
    }
    if(num15>=15) {
      data[2][dataSize[2]]=sum15/num15; dataSize[2]++; sum15=0; num15=0;
    }
    if(num60>=60) {
      data[3][dataSize[3]]=sum60/num60; dataSize[3]++; sum60=0; num60=0;
    }
    
    //reposition time buffer
    for(var i=0; i<4; i++) {
      if(dataSize[i]>512*2) {
        for(var j=0; j<512; j++) {
          data[i][j]=data[i][j+512];
          dataSize[i]=512;
        }
      }
    }

  }




  //TODO do this when we reposition time buffer
  //var dft = new DFT(1024, 44100);
      //dft.forward(signal);
      //var spectrum = dft.spectrum;


}



function query() {
  var feature = extractFeatures();
  var sum = new Array();
  for(var i=0; i<3; i++) {
    sum[i]=0;
  }
  
  for(var i=0; i<numFeatures; i++) {
    var vals = new Array();
    var insum = 0;
    for(var type=0; type<3; type++) {
      var cur = feature[i];
      vals[type]=Math.abs((cur-featureAvg[type][i])/featureStd[type][i]);
      if(vals[type]==0)
        vals[type]=10;
      else
        vals[type]=1/vals[type];
      insum+=vals[type];
    }
    for(var type=0; type<3; type++) {
      var cur = feature[i];
      sum[type]+=vals[type]/insum;
    }
  }
  console.log(sum[0]+" "+sum[1]+" "+sum[2]);
  var ans = 0;
  for(var i=0; i<3; i++) {
    ans+=sum[i];
  }
  console.log(sum[0]/ans+" "+sum[1]/ans+" "+sum[2]/ans);
  return ans;

}


function train(type) {
  var feature = extractFeatures();
  for(var i=0; i<numFeatures; i++) {
    console.log(feature[i]);
  }
  for(var i=0; i<numFeatures; i++) {
    featureSum[type][i]+=feature[i];
    featureSum2[type][i]+=feature[i]*feature[i];
    featureNum[type][i]++;
    featureAvg[type][i]=featureSum[type][i]/featureNum[type][i];
    featureStd[type][i]=Math.sqrt(featureSum2[type][i]-2*featureSum[type][i]*featureAvg[type][i]+featureAvg[type][i]*featureAvg[type][i])/featureNum[type][i];
    if(featureStd[type][i]==0)
      featureStd[type][i]=1;
  }
}


//Note: times are scaled down so all of the data time sizes are actually the same length when we are analyzing them, it's just lower quality

var nil = 10000000;

function extractFeatures() {

  var times = new Array();
  times[0]=60; // 40s
  times[1]=15; // 
  times[2]=5;
  times[3]=1;


  var feature = new Array();
  for(var time=0; time<4; time++) {
    feature[time*7+0]=calcAvg(time);
    feature[time*7+1]=calcHigh(time);
    feature[time*7+2]=calcHigh10(time);
    feature[time*7+3]=calcStd(time, feature[time*7+0]);
    feature[time*7+4]=calcLow(time);
    feature[time*7+5]=calcLow10(time);
    feature[time*7+6]=calcRange(time, feature[time*7+5], feature[time*7+2]);
  }
  
  return feature;
}


function clearData() {

  data = new Array();
  dataSize = new Array();

  for(var i=0; i<4; i++) {
    data[i] = new Array();
    dataSize[i]=0;
  }
  sum1=0; num1=0;
  sum5=0; num5=0;
  sum15=0; num15=0;
  sum60=0; num60=0;

}



var TIMESIZE=512;

function calcAvg(time) {
  var sum=0;
  var num=0;
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize[time]; i++) {
    sum+=data[time][i]; num++;
  }
  if(num==0)
    return nil;
  var avg=sum/num;
  return avg;
}

function calcHigh(time) {
  var high=-1*nil;
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize[time]; i++) {
    if(data[time][i]>high) {
      high=data[time][i];
    }
  }
  return high;
}

function calcLow(time) {
  var low=nil
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize[time]; i++) {
    if(data[time][i]<low) {
      low=data[time][i];
    }
  }
  return low;
}

function calcLow10(time) {
  var low = new Array();
  for(var i=0; i<TIMESIZE/5; i++) {
    low[i]=nil;
  }
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize[time]; i++) {
    for(var j=0; j<TIMESIZE/5; j++) {
      if(data[time][i]<low[j]) {
        for(var k=TIMESIZE/5-1; k>j; k--) {
          low[k+1]=low[k];
        }
        low[j]=data[time][i];
        break;
      }   
    }
  }
  var sum=0;
  var num=0;
  for(var i=0; i<TIMESIZE/5; i++) {
    if(low[i]==nil)
      continue;
    sum+=low[i];
    num++;
  }
  if(num==0)
    return nil;
  return sum/num;
}

function calcHigh10(time) {
  var high = new Array();
  for(var i=0; i<TIMESIZE/5; i++) {
    high[i]=-1*nil;
  }
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize[time]; i++) {
    for(var j=0; j<TIMESIZE/5; j++) {
      if(data[time][i]>high[j]) {
        for(var k=TIMESIZE/5-1; k>j; k--) {
          high[k+1]=high[k];
        }
        high[j]=data[time][i];
        break;
      }   
    }
  }
  var sum=0;
  var num=0;
  for(var i=0; i<TIMESIZE/5; i++) {
    if(high[i]==-1*nil)
      continue;
    sum+=high[i];
    num++;
  }
  if(num==0)
    return nil;
  return sum/num;
}

function calcStd(time,avg) {
  var sum=0;
  for(var i=Math.max(dataSize[time]-TIMESIZE,0); i<dataSize; i++) {
    var d = data[time][i]-avg;    
    sum+=d*d;
  }
  if(Math.max(dataSize[time]-TIMESIZE,0)==0)
    return nil;
  return sum/Math.max(dataSize[time]-TIMESIZE,0);
}

function calcRange(time,low,high) {
  return high-low;
}



