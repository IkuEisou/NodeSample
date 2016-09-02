module.exports = Car;
const db = require('./setdb');
function Car(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

Car.createtable = function (fn) {
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query(' CREATE TABLE IF NOT EXISTS nodeCar(' +
  			   ' ID         BIGINT  NOT NULL,' + 
  			   ' NAME       VARCHAR(255), ' +
  			   ' COLOR      VARCHAR(255), ' +
  			   ' ZAIKO      BOOLEAN, ' +
  			   ' HAIKIRYOU  FLOAT, ' +
  			   ' NENPI      FLOAT, ' +
  			   ' MILAGE     INTEGER, ' +
  			   ' NENSHIKI   VARCHAR(255), ' +
  			   ' COMMENT    VARCHAR(255), ' +
  			   ' LASTUPDATE TIMESTAMP, PRIMARY KEY (ID) )',
         function function_name(err, result) {
           if (err) {
             console.error('Create car table failed on the db' + err.message);
             client.end();
             return fn(err);
           }
           console.log('Create car table successed on the db');
           client.end();
           fn(null);
        });
    });	
}

Car.deletetable = function (fn) {
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query(' DROP TABLE IF EXISTS nodeCar ',
         function function_name(err, result) {
           if (err) {
             console.error('Delete car table failed on the db' + err.message);
             client.end();
             return fn(err);
           }
           console.log('Delete car table successed on the db');
           client.end();
           fn(null);
        });
    });	
}

Car.tbExist = function (fn) {
  db.connect(function(err, client){
    if(err || !client) return fn(err);
    client.query('select * from nodecar', 
       function (err, result) {
         if (err) {
           console.error('Table doesn\'t exist!' + err.message);
           client.end();
           return fn(err);
         }
         client.end();
         console.log('Table exist!' );
         fn(null);
      });

  });
}

Car.prototype.save = function(fn){
    var car = this;
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query('insert into nodecar (id, name, color, zaiko, haikiryou,'  + 
        'nenpi, milage, nenshiki, comment, lastupdate)' + 
        ' values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', 
        [car.id, car.name, car.color, car.zaiko, car.haikiryou, car.nenpi, 
        car.milage, car.nenshiki, car.comment, car.lastupdate], 
         function function_name(err, result) {
           if (err || !result) {
             console.error('Car save failed ' + err.message);
             client.end();
             return fn(err, null);
           }
           var newCar = result.rows[0];
           client.end();
           fn(null, newCar);
        });
    });
};

Car.prototype.update = function(fn){
    var car = this;
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query('update nodecar set name=$2, color=$3, zaiko=$4, '+
        'haikiryou=$5, nenpi=$6, milage=$7, nenshiki=$8, comment=$9, '+
        'lastupdate=$10 where id = $1', 
        [car.id, car.name, car.color, car.zaiko, car.haikiryou, car.nenpi, 
        car.milage, car.nenshiki, car.comment, car.lastupdate], 
         function function_name(err, result) {
           if (err || !result) {
             console.error('Car update failed ' + err.message);
             client.end();
             return fn(err);
           }
           client.end();
           fn(null);
        });
    });
};

Car.del = function(id, fn){
    db.connect(function(err, client){
      if(err || !client) return fn(err);
      client.query('delete from nodecar where id = $1 ', [id], 
         function (err, result) {
           if (err) {
             console.error('Delete car failed ' + err.message);
             client.end();
             return fn(err);
           }
           console.log('Delete db car is ok');
           client.end();
           fn(null);
        });
    });
};

Car.getByID = function(id, fn){
  Car.getCar(id, function(err, car){
    if (err) {
      console.error('getCar is error');
      return fn(err);
    }
    fn(null, car);
  });
};

Car.getCar = function(id, fn){
  db.connect(function(err, client){
    if(err || !client) return fn(err);
    client.query('select * from nodecar where id = $1', [id], 
       function (err, result) {
         if (err) {
           console.error('Query failed ' + err.message);
           client.end();
           return fn(err);
         }
         var car = result.rows[0];
         client.end();
         fn(null, car);
      });
  });
};
