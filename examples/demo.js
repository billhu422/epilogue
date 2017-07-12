var Sequelize = require('sequelize'),
    epilogue = require('../../epilogue'),
    http = require('http');

// Define your models
//mysql://localhost:3306/database
//var database = new Sequelize('inventory', 'root', 'qaz123',{
//	host:'192.168.87.152'
//});

var database = new Sequelize('mysql://sequelize_test:sequelize_test@192.168.87.152:8999/sequelize_test',{});

var User = database.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

// Initialize server
var server, app;
if (process.env.USE_RESTIFY) {
  var restify = require('restify');

  app = server = restify.createServer()
  app.use(restify.queryParser());
  app.use(restify.bodyParser());
} else {
  var express = require('express'),
      bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server = http.createServer(app);
}

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database,
  updateMethod: 'put'
});

// Create REST resource
var userResource = epilogue.resource({
  model: User,
  endpoints: ['/users', '/users/:id']
});

// Create database and listen
database
//  .sync({ force: true })
  .sync({ force: false })
  .then(function() {
    server.listen(3000,function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });
