var express = require('express');
var router = express.Router();
var HazelcastClient = require('hazelcast-client').Client;
var Config = require('hazelcast-client').Config;

var config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: process.env.HZ_HOST || "localhost", port: process.env.HZ_PORT || 5701}];

const LIST_NAME = "randomlist"

function getList(){
  return HazelcastClient
      .newHazelcastClient(config)
      .then(hazelcastClient => hazelcastClient.getList(LIST_NAME))
      .then(list => {
        if (list == null)
          return null;
        return list;
      })
      .catch(error => {
          console.log(error);
          return null;
      });
};

function renderList(res, list){
  res.render('index', {
    size: list == null? 0 : list.length,
    cache: list == null? 'empty' : list.join('<br>')
  });
};

function renderError(res, error){
  res.render('index', { size: 0, cache: error });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  getList()
  .then(list => list.toArray())
  .then(list => renderList(res, list))
  .catch(error => renderError(res, error));
});

/* GET home page. */
router.post('/', function(req, res, next) {
  getList()
  .then(list => {
    if(list){
      list.add(Math.random())
      return list.toArray()
    }

    return null;
  })
  .then(list => renderList(res, list))
  .catch(error => renderError(res, error));
});

module.exports = router;
