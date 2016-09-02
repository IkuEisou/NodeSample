const pg = require('pg');
const util = require('util');
var fs = require('fs'),
    nconf = require('nconf');
var result="The result of the ConnectDB: ";

exports.connect = function (fn) {
	var conString='';
	//環境変数VCAP_SERVICESのDB接続情報の存在を確認して、ある場合だけ実行
	if(!process.env.VCAP_SERVICES){
		console.log("VCAP_SERVICES is null!");
		nconf.argv()
		   .env()
		   .file({ file: 'config.json' });
		var connectInfo = nconf.get('database');
		if(!connectInfo){
		  console.log('DB connect failed!');
	          return fn(null,null);
		}
		console.log('database: ' + JSON.stringify(connectInfo));
		conString="tcp://"+connectInfo.username+":"+connectInfo.password+"@"+connectInfo.host+":"+connectInfo.port+"\/"+connectInfo.name;
	}else{
	  //環境変数VCAP_SERVICESのDB接続情報の存在を確認して、ある場合だけ実行
	  var env_sv = JSON.parse(process.env.VCAP_SERVICES);

	  if((2 < util.inspect(env_sv).length) &&
	   (-1 != util.inspect(env_sv).indexOf('user-provided')))
	  {  
            var env_app = JSON.parse(process.env.VCAP_APPLICATION); 
            //サービス情報からDB接続情報部分を取得
            var host = env_sv["user-provided"][0].credentials.hostname;
            var port = env_sv["user-provided"][0].credentials.port;
            var db = env_sv["user-provided"][0].credentials.name;
            var db_name = env_sv["user-provided"][0].credentials.username;
            var db_pass = env_sv["user-provided"][0].credentials.password;
            conString="tcp://"+db_name+":"+db_pass+"@"+host+":"+port+"\/"+db;
	  }
	  else{
	    conString = env_sv["elephantsql"][0].credentials.uri;
	    //console.log("\n環境変数\"VCAP_SERVICES\"の中のDB接続情報を確認出来なかった為、DB関連処理をスキップしました。\n");
	    //return fn(null,null);
	  }
	}

	console.log('DataBase:' + conString);
	 //DBへ接続
	var client = new pg.Client(conString);
	client.connect(function(err){
	   if(err){
	     console.error('Could not connect to postgres',err);
	     client.end();
	     result+="DBConnect is Failed!";
	     return fn(err,null);
	   }  
	   result+="DBConnect is OK!";
	   console.log("DBConnect is OK!");
	   fn(null,client);
        });
}
