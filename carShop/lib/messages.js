var express = require('express');

var fs = require('fs'),
    nconf = require('nconf'),
    res = express.response;

res.message = function(msg, type){
  type = type || 'info';
  var sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push({ type: type, msg: msg });
};

res.error = function(msg){
  return this.message(msg, 'error');
};

res.getMsg = function(type){
  var messages =  this.locals.msgpool;
  if(!messages.length){
	console.log('Messages pool is empty!');
	return null;
  }
  var results;
  messages.filter(function(obj){
     if(obj.type == type) {
       console.log( "Message is " +  JSON.stringify(obj));
       results = obj;
     }
  });
  return results;
};

module.exports = function(req, res, next){
  res.locals.messages = req.session.messages || [];
  var msgpool = res.locals.msgpool = req.session.msgpool || [];
  if(!msgpool.length){
      nconf.argv()
           .env()
           .file({ file: 'config.json' });
      var msgs = nconf.get('msglist');
      if(msgs){ 
      	for( var type in msgs){
          var msg = nconf.get('msglist')[type];
          msgpool.push({type: type, msg: msg});
      	}
          console.log("Initing message pool");
      }
  }

  res.locals.removeMessages = function(){
    req.session.messages = [];
  };
  next();
};
