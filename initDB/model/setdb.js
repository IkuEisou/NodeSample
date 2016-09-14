const pg = require('pg');
const util = require('util');
var fs = require('fs'),
    nconf = require('nconf');

exports.connect = function (fn) {
  var conString='';
  var env_sv = process.env.VCAP_SERVICES;
  if(env_sv){
        env_sv = JSON.parse(env_sv);
  }
  //console.log(env_sv);
  if(env_sv && 2 < util.inspect(env_sv).length){
      	var env_app = JSON.parse(process.env.VCAP_APPLICATION); 
	      //FJのDBサービス情報からDB接続情報部分を取得
	      if (-1 != util.inspect(env_sv).indexOf('fujitsu-rds'))
       	{
       		conString = env_sv['fujitsu-rds'][0].credentials.uri;
       		strAppName = env_app.application_name;
       		strAppUri = env_app.application_uris[0].replace(/\./g, '_').replace(/-/g, '_');
        	console.log("==============================================");
       		console.log("DB Connect String = " + conString);
       		console.log("AppName = " + strAppName);
        	console.log("AppURI[0](TABLE NAME) = " + strAppUri);
       	 }
       	//FNSTのDBサービス情報からDB接続情報部分を取得
 	      else if( -1 != util.inspect(env_sv).indexOf('user-provided'))
	      {  
            var host = env_sv["user-provided"][0].credentials.hostname;
       	    var port = env_sv["user-provided"][0].credentials.port;
            var db = env_sv["user-provided"][0].credentials.name;
       	    var db_name = env_sv["user-provided"][0].credentials.username;
            var db_pass = env_sv["user-provided"][0].credentials.password;
       	    conString="tcp://"+db_name+":"+db_pass+"@"+host+":"+port+"\/"+db;
  	    }
  }
  else{
	     console.log("\n環境変数\"VCAP_SERVICES\"の中のDB接続情報を確認出来なかった為、DB配置ファイルを利用しました。\n");
       nconf.argv()
            .env()
            .file({ file: 'config.json' });
       var connectInfo = nconf.get('database');
       if(!connectInfo){
             console.log('\nDB接続情報を確認出来なかった為、DB関連処理をスキップしました。\n');
             return fn(null,null);
        }
       conString="tcp://"+connectInfo.username+":"+connectInfo.password+"@"+connectInfo.host+":"+connectInfo.port+"\/"
			+connectInfo.name;
  }

  //console.log('DataBase:' + conString);
  //DBへ接続
  var client = new pg.Client(conString);
  client.connect(function(err){
	if(err){
		console.error('Could not connect to postgres',err);
		client.end();
		return fn(err,null);
	}  
	fn(null,client);
  });
}

