const db = require('./setdb');
const fs = require('fs');

dosql = function (sql) {
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query(sql, 
         function function_name(err, result) {
           if (err) {
             console.error('Error:' + err.message);
             client.end();
           }else{
             client.end();
	   }
        });
    });	
}

exports.crtUsrTb = function(tbname){
      var sql = fs.readFileSync('user.sql.temp','utf8'); 
      sql = sql.replace(/fillme/g, tbname);
      dosql(sql);
}
