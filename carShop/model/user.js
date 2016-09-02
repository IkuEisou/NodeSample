const db = require('./setdb');
var bcrypt = require('bcrypt');
module.exports = User;

function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

User.prototype.save = function(fn){
  var user = this;
  user.hashPassword(function(err){
        if (err) return fn(err);
    	db.connect(function(err, client){
        	if (err || !client) return fn(null);
	        client.query('insert into nodeuser (id, pwd, type, salt) ' + 
	          'values($1,$2,$3,$4)', [user.id, user.pwd, user.type, user.salt], 
        	  function (err, result) {
	            if (err) {
        	      console.error('User save failed: ' + err.message);
	              client.end();
        	      return fn(err);
	            }
        	    console.log('New user is ok!');
	            client.end();
        	    fn(null, user);
          	});
	});
 });
};

 User.prototype.update = function(fn){
   var user = this;
   user.hashPassword(function(err){
      if (err) return fn(err);
      db.connect(function(err, client){
       	if (err || !client) return fn(null);
        client.query('update nodeuser set pwd = $1, salt = $2 where id = $3 ', [user.pwd, user.salt, user.id], 
        	function function_name(err, result) {
	          if (err) {
        	    console.error('User update failed :' + err.message);
	            db.end();
	            return fn(err);
        	  }
	          console.log('Update user is ok!');
        	  client.end();
	          fn(null);
       });
     });  
  });
 };

 User.prototype.hashPassword = function(fn){
   var user = this;
   bcrypt.genSalt(12, function(err, salt){
     if (err) return fn(err);
     user.salt = salt;
     console.log("salt is " +salt);
     bcrypt.hash(user.pwd, salt, function(err, hash){
       if (err){
	 console.log(err);
	 return fn(err);
       }	
       user.pwd = hash;
       fn(null);
     })
   });
 };

User.del = function(name, fn){
  db.connect(function(err, client){
    if (err || !client) return fn(null);
    client.query('delete from nodeuser where id = $1 ', [name], 
       function function_name(err, result) {
         if (err) {
           console.error('Delete user failed :' + err.message);
           client.end();
           return fn(err);
         }
         console.log('Delete user is ok!');
         client.end();
         fn(null);
      });
  });
};

User.getByName = function(name, fn){
  User.getUser(name, function(err, user){
    if (err) {
      console.error('Get user failed!');
      return fn(err);
    }
    fn(null, user);
  });
};

User.getUser = function(name, fn){
  db.connect(function(err, client){
    if (err || !client) return fn(null);
    client.query('select * from nodeuser where id = $1', [name], 
       function (err, result) {
         if (err) {
           console.error('Query user failed :' + err.message);
           client.end();
           return fn(err);
         }
         var user = result.rows[0];
         client.end();
         fn(null, user);
      });
  });
};

User.authenticate = function(name, pass, fn){
  User.getByName(name, function(err, user){
    if (err) return fn(err);
    if (!user) return fn();
    if (user.salt){
    	bcrypt.hash(pass, user.salt, function(err, hash){
	      if (err) return fn(err);
	      if (hash  == user.pwd) {
	         return fn(null, user);
	      }
   	fn();
   	});
    }
    else{
	if (pass == user.pwd){
                 return fn(null, user);
	}
    }
 });
};
