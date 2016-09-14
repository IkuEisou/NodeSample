var Car = require('../model/car');
var date = require('moment');

exports.addcar = function (req, res, next) {
	var id = req.body.id;

	Car.getByID(id, function(err, car){
		var msgType, result, msg;
		if (err){
			msg = '{"msg" : "Add car failed!", "status" : 500}';
			console.log(msg);
			msgType = "addcarng";

			result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
         		}
			else
			   res.end(msg);
		}
		else if (car) {
			msg = '{"msg" : "Car already taken", "status" : 302}';
			console.log(msg);
			msgType = "carext";
			result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
         		}
			else
			   res.end(msg);
		}
		else{    
	      		car = new Car({
				id: id,
				name: req.body.name,
				color: req.body.color,
				zaiko: req.body.zaiko,
				haikiryou: req.body.haikiryou,
				nenpi: req.body.nenpi,
				milage: req.body.milage,
				nenshiki: req.body.nenshiki,
				comment: req.body.comment,
				lastupdate: date().format()
	      		});

			car.save(function(err){
				if (err){
					msg = '{"msg" : "Add car failed", "status" : 500}';
					msgType = "addcarng";
				}
				else{
					msg = '{"msg" : "Add car successfully", "status" : 200}';
					msgType = "addcarok";
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

exports.delcar = function (req, res, next) {
	var id = req.body.id;
	Car.getByID(id, function(err, car){
		var msgType, result,msg;
		if (err){
			msg = '{"msg" : "Delete car failed", "status" : 500}';
			console.log(msg);
			msgType = "delcarng";
			result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
			}
			else
				res.end(msg);
		}
		else if (!car) {
			msg = '{"msg" : "Car  doesn\'t exist!", "status" : 404}';
			console.log(msg);
			msgType = "carnoext";
                        result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
			}
			else
				res.end(msg);
	    	}
		else {
      			Car.del(id, function(err){
        			if (err){
					msg =  '{"msg" : "Delete car failed", "status" : 500}';
					console.log(msg);
					msgType = "delcarng";
					result = res.getMsg(msgType);
			                if(result && result.msg) {
						res.end(JSON.stringify(result));
			                }
				        else
						res.end(msg);
				}
				else{
					msgType = "delcarok";
					msg = '{"msg" : "Delete car successfully", "status" : 200}';
					console.log(msg);
					result = res.getMsg(msgType);
		        	        if(result && result.msg) {
						res.end(JSON.stringify(result));
		               		}
	        			else
						res.end(msg);
				}
      			});
    		}
  	});	
};

exports.updatecar = function (req, res, next) {
	var id = req.body.id;
	Car.getByID(id, function(err, car){
		var msgType, result, msg;
		if (err){
			msgType = "updcarng";
			msg =  '{"msg" : "Update car failed", "status" : 500}';
			console.log(msg);

                        result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
			}
			else
				res.end(msg);
		}
		else if (!car) {
			console.log("Car doesn\'t exsit!");
			msgType = "carnoext";
                        msg = '{"msg" : "Car doesn\'t exsit!", "status" : 404}';
                        console.log(msg);
                        result = res.getMsg(msgType);
                        if(result && result.msg) {
                                res.end(JSON.stringify(result));
                        }
                        else
                                res.end(msg);

		}else{
			car = new Car({
			id: id,
			name: req.body.name,
			color: req.body.color,
			zaiko: req.body.zaiko,
			haikiryou: req.body.haikiryou,
			nenpi: req.body.nenpi,
			milage: req.body.milage,
			nenshiki: req.body.nenshiki,
			comment: req.body.comment,
			lastupdate: date().format('YYYY-MM-DD HH:mm:ss')
			});
			car.update(function(err){
				if (err){
					msgType = "updcarng";
		                        msg =  '{"msg" : "Update car failed", "status" : 500}';
                		        console.log(msg);
	
        		                result = res.getMsg(msgType);
					if(result && result.msg) {
						res.end(JSON.stringify(result));
					}
					else
						res.end(msg);
				}
				else {
					msgType = "updcarok";
                                        msg = '{"msg" : "Update successfully!", "status" : 200}';
                                        console.log(msg);

                                        result = res.getMsg(msgType);
                                        if(result && result.msg) {
                                                res.end(JSON.stringify(result));
                                        }
                                        else
                                                res.end(msg);
	        	  	}	 
	      		});
	    }
 	});
};

exports.srhcar = function (req, res, next) {
	var id = req.body.id;

	Car.getByID(id, function(err, car){
		var msgType, result,msg;

		if (err){
			msgType = "srhcarng";
			msg =  '{"msg" : "Search car failed", "status" : 500}';
			console.log(msg);
			result = res.getMsg(msgType);
			if(result && result.msg) {
				res.end(JSON.stringify(result));
			}
			else
				res.end(msg);
		}		
		else if (!car) {
			msgType = "carnoext";
			msg =  '{"msg" : "Car doesn\'t exsit!", "status" : 404}';
			console.log(msg);
                        result = res.getMsg(msgType);
                        if(result && result.msg) {
				res.end(JSON.stringify(result));
                        }
                        else{
                                res.end(msg);
                        }
		}
		else{
			msg = '{"msg" : "Search car successfully!", "status" : 200}';
			console.log(msg);
			car.zaiko ? car.zaiko='有' : car.zaiko='無';
			res.end(JSON.stringify(car));
	    	}
 	});
};
