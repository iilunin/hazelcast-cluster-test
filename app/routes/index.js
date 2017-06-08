var express = require('express');
var router = express.Router();
var HazelcastClient = require('hazelcast-client').Client;
var Config = require('hazelcast-client').Config;

var config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: process.env.HZ_HOST, port: process.env.HZ_PORT}];

var list = null;

HazelcastClient
    .newHazelcastClient(config)
    .then(function (hazelcastClient) {
        list = hazelcastClient.getList("randomlist");
    });

/* GET home page. */
router.get('/', function(req, res, next) {
  list.size().then(function(size){
    if (size > 0){
        list.toArray().then(function(vals){
          res.render('index', { size: size, cache: vals.join('<br>') });
        })
    }else{
        res.render('index', { size: 0, cache: 'empty' });
    }
  }).catch(function(error){
    res.render('index', { size: 0, cache: error });
  });
});

/* GET home page. */
router.post('/', function(req, res, next) {

  list.add(Math.random()).then(function(v){
    console.log(v);
      // res.render('index', { size: 0, cache: v })
  }).catch(function(e){
    console.log(e);
  }).then(list.size().then(function(size){
    if (size > 0){
        list.toArray().then(function(vals){
          res.render('index', { size: size, cache: vals.join('<br>') });
        })
    }else{
      res.render('index', { size: 0, cache: 'empty' });
    }
  })
  );
});

module.exports = router;
