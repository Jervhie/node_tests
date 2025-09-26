
// var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    // log all information upon request
    console.log({
      method: req.method,
      headers: req.headers,
      ip: req.ip,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body || "No body"
    });
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
});

// helpers
const getCurrentTime = () => {
  let currentTime = new Date();
  let timeString = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  return timeString;
}

// Timestamp Middlewares
app.get('/api/:date?', (req, res) => {
  let givenDate = req.params.date;
  if(!givenDate) {
    res.json({
      unix: getCurrentTime(),
      utc: getCurrentTime()
    })
  };

  if(new Date(givenDate) === "Invalid Date"){
    res.json({ error : "Invalid Date" }); 
  };

  let date = {
    unix: new Date(givenDate).getTime(),
    utc: new Date(givenDate).toUTCString()
  }

  res.json(date);
});

// console.log("Current Time: ", getCurrentTime());

//Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + listener.address().port);
});

