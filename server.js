var fs = require("fs");
var express = require("express");
var app = express();
var PORT = process.argv[2] || 8000;

app.use("/public",express.static(__dirname + "/public"));

app.get("/article_data",function(request,response) {
  if ( request.query.file.indexOf("..") > -1 ) {
    response.send(400);
    return;
  }
  fs.readFile(`${__dirname}/editions/${request.query.file}.json`,function(err,data) {
    if ( err ) {
      response.send(400);
      if ( err.code != "ENOENT" ) console.error(err);
      return;
    }
    data = JSON.parse(data);
    var index = parseInt(request.query.index);
    if ( data[index] ) response.send(JSON.stringify(data[index]));
    else response.send(400);
  });
});

app.get("/edition_data",function(request,response) {
  if ( request.query.file.indexOf("..") > -1 ) {
    response.send(400);
    return;
  }
  fs.readFile(`${__dirname}/editions/${request.query.file}.json`,function(err,data) {
    if ( err ) {
      response.send(400);
      if ( err.code != "ENOENT" ) console.error(err);
      return;
    }
    data = JSON.parse(data);
    var format = {
      edition: data[0].edition,
      articles: data.map(item => {return {
        title: item.title,
        thumbnail: item.thumbnail
      }})
    }
    response.send(JSON.stringify(format));
  });
});

app.get("/",function(request,response) {
  response.redirect("/public");
});

app.listen(PORT,function() {
  console.log("Listening on port " + PORT);
});
