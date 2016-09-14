var User = require('../model/user');
var Car = require('../model/car');

exports.regist = function(req, res, next){
	var name = req.body.name;
	var pass = req.body.pass;
	
	User.getByName(name, function(err, user){
		var msgType, result, msg;
		if (err){ 
				msg = '{"msg" : "Search user failed!", "status" : 500}';
                	        console.log(msg);
                       		msgType = "srhusrng";
                       	 	result = res.getMsg(msgType);
                        	if(result && result.msg) {
					res.end(JSON.stringify(result));
	                        }	
        	                else
					res.end(msg);
		}
		if (user) {
			var newUser = new User({
				id: user.id,
				pwd: pass,
			        type: user.type,
			        salt: user.salt
		      	});
			newUser.update(function(err){
				if(err) {
					msg =  '{"msg" : "Modify password failed!", "status" : 500}';
					msgType = 'modpwdng';
			 	}
				else{
					msgType = 'modpwdok';
					msg =  '{"msg" : "Modify password successfully!", "status" : 200}';
			 	}
		                console.log(msg);
				result = res.getMsg(msgType);
		       		if(result && result.msg) {
        				res.end(JSON.stringify(result));
		        	}
		                else
        		       	        res.end(msg);
			});
		}	
		else{
			user = new User({
				id: name,
				pwd: pass,
				type: 0,
				salt: null
			});
			user.save(function(err){
				if (err){
	        	                msg =  '{"msg" : "Add user failed!", "status" : 500}';
					msgType = 'addusrng';
				}
          			else {
					req.session.uid = user.type;
					msg =  '{"msg" : "Add user successfully!", "status" : 200}';
					msgType = 'addusrok';
	  			}
				console.log(msg);
				result = res.getMsg(msgType);
				if(result && result.msg) {
					res.end(JSON.stringify(result));
				}
        	                else
	                                res.end(msg);

			});
		}
	});
};

exports.deluser = function(req, res, next){
	var name = req.body.delname;
	User.getByName(name, function(err, user){
		var msgType,result,msg;
		if (err){
			msg = '{"msg" : "Search user failed!", "status" : 500}';
                        console.log(msg);
                        msgType = "srhusrng";
                        result = res.getMsg(msgType);
                        if(result && result.msg) {
                                 res.end(JSON.stringify(result));
                        }
                        else
                                 res.end(msg);
		}

    		else if (!user) {
			msg='{"msg" : "User doesn\'t exist!", "status" : 404}';
                        console.log(msg);
			msgType = 'usrnoext';
			result = res.getMsg(msgType);
			if(result && result.msg) {
			          res.end(JSON.stringify(result));
			}
                        else
				res.end(msg);
		}
		else {
			if(user.type){
				msg = '{"msg" : "Cann\'t delete admin!", "status" : 403}';
				console.log(msg);
				msgType = "canndelusr";
				result = res.getMsg(msgType);
	                        if(result && result.msg) {
        	                       res.end(JSON.stringify(result));
                	        }
                        	else{
                                       res.end(msg);
				}
				return;
			}
			User.del(name, function(err){
				if (err){
                        		msg='{"msg" : "Delete user failed!", "status" : 500}';
		                        msgType = 'delusrng';

				}
				else{
				        msgType = 'delusrok';
					msg = '{"msg" : "Delete user successfully", "status" : 200}';
				}
                        	console.log(msg);
                                result = res.getMsg(msgType);
                                if(result && result.msg) {
                                        res.end(JSON.stringify(result));
                                }
	                        else
        	                        res.end(msg);
			});
    		}
	});
};

exports.crttable = function (req, res, next) {
	var msgType, result,msg;
	Car.tbExist(function(err){
  		if(!err){ 
			msg = '{"msg" : "Table exists!", "status" : 302}';
			console.log(msg);
			msgType = 'tbext';
	                result = res.getMsg(msgType);
        	        if(result &&  result.msg) {
                	       res.end(JSON.stringify(result));
	                }
                        else
                               res.end(msg);

		}
		else{
  			Car.createtable(function (err) {
				if (err){
					msgType = 'crttbng';
					msg = '{"msg" : "Create table failed", "status" : 500}';
				}
				else {
					msg = '{"msg" : "Create table successfully", "status" : 200}';
					msgType = 'crttbok';
				}
				result = res.getMsg(msgType);
	                        console.log(msg);
				if(result &&  result.msg) {
				        res.end(JSON.stringify(result));
     				 }
	                        else
        	                       res.end(msg);

			});
		}
	});
};

exports.deltable = function (req, res, next) {
	var msgType, result,msg;
	Car.tbExist(function(err){
        	if(err){
			msg = '{"msg" : "Table doesn\'t exist!", "status" : 404}';
			console.log(msg);
	                msgType = 'tbnoext';
        	        result = res.getMsg(msgType);
                	if(result &&  result.msg) {
	                       res.end(JSON.stringify(result));
        	        }
                        else
                               res.end(msg);
	        }
	        else{
			Car.deletetable(function (err) {
				if (err){
					msg = '{"msg" : "Delete table failed", "status" : 500}';
					msgType = 'deltbng';
				}
				else {
		      			msg = '{"msg" : "Delete table successfully", "status" : 200}';
					msgType = 'deltbok';
				}
				console.log(msg);
				result = res.getMsg(msgType);
				if(result && result.msg) {
				        res.end(JSON.stringify(result));
     				 }
	                        else
        	                       res.end(msg);
			});
		}
	});
};
