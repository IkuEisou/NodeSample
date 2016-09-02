const User = require('../model/user');

exports.submit = function (req, res, next) {
	var name = req.body.username;
	var pass = req.body.password;
	var result,msgType;

	if (!name || !pass) {
		msgType = "loginng";
		result = res.getMsg(msgType);
		if(result && result.msg) {
			res.error(result.msg);
			res.redirect('/');
		}
	}

  	User.authenticate(name, pass, function(err, user){
	    if (err) return next(err);
	    if (user) {
	      req.session.uid = user.type;
	      if (!user.salt){
        	var admin = new User(user);
        	admin.update(function(err){
		  if(err) console.log('Password hashed failed!');
		});
    	      }
	      if (1 == user.type) {
	      	res.redirect('/manage');
	      }else{
	      	res.redirect('/carshop');
	      }

	    } else {
		msgType = "loginng";
		result = res.getMsg(msgType);
		console.log('result is ' + result.msg);
		if(result && result.msg) {
			res.error(result.msg);
			res.redirect('/');
		}
	    }
  	});
}

exports.logout = function(req, res){
	req.session = null;
	res.redirect('/');
};

