var Sequelize = require('sequelize'),
    epilogue = require('../../epilogue'),
    http = require('http'),
    config = require('./config');

// Define your models

var database = new Sequelize(config.dbConnection,{});

var Inventory = database.define('Inventory',{
  orderId: Sequelize.BIGINT(20),
  orderItemId: Sequelize.BIGINT(20),
  userId: Sequelize.STRING,
  provider: Sequelize.STRING,
  productName: Sequelize.STRING,
  instanceId: Sequelize.STRING,
  region: Sequelize.STRING,
  note: Sequelize.TEXT,
  del:Sequelize.INTEGER
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
  model: Inventory,
  endpoints: ['/inventory/instance', '/inventory/instance/:id']
});

// Create database and listen
database
//  .sync({ force: true })
  .sync({ force: false })
  .then(function() {
    server.listen(config.port,function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });
