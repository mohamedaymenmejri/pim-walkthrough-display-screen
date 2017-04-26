var express = require('express');
var app = express();
var http = require('http');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path	=	require("path");
var mysql	=	require("mysql");
var router	=	express.Router();

require('events').EventEmitter.defaultMaxListeners = Infinity;

app.use(express.static(__dirname));

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// var getJSON = require('get-json')
//var request = require("request")

var pool    =    mysql.createPool({
      connectionLimit   :   100,
      host              :   'localhost',
      user              :   'root',
      password          :   'aymen11859835',
      database          :   'smart_queue',
      debug             :   false
});


var url = "http://192.168.1.3:8080/smart_queue/public/api/ticket_windows/status?office_id=1"
var url1 = "http://192.168.1.6:8080/smart_queue/public/api/tickets/waiting?office_id=1"
var ticketInfo =[];
var office_id = 1;


var donne = [
  {
    "service": "Vire",
    "member": "5ou5a zayati",
    "ticket_number": 1555,
    "window_number": 1
  },
  {
    "service": "Mandat bank",
    "member": "Mohamed Cherni",
    "ticket_number": 1,
    "window_number": 2
  },
  {
    "service": "Virement",
    "member": "Mouldi l Baney",
    "ticket_number": 1,
    "window_number": 3
  }
]


router.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

var idtut = 0;


router.get('/changestatus',function(req,res){
	 ChangeStatusToDone(idtut,function(error,result){

			if(error) {
				
			} else {
//				io.emit("count ticket", result);
                console.log("ended",result);
			}
		});
});





app.use('/',router);

io.on('connection',function(socket){
//	console.log('We have user connected !');
//    console.log('sdsdvsdv !');

//    var i = 0;

  setInterval(function() {
//      i = i + 1;
//      console.log("test marche depuit"+ i);
      getDataTicket(function(error,result){

			if(error) {
				io.emit('error');
			} else {
//				io.emit("count ticket", result);
                
                io.emit('refresh feed',result);
                
			}
		});
    }, 1000);

    setInterval(function() {
      
      getDataTicketwaiting(function(error,result){

			if(error) {
				io.emit('error');
			} else {
                
                io.emit('waiting',result);
                
			}
		});
      
    }, 1000);
    
    setInterval(function() {
      
      CheckStatus(function(error,result){

			if(error) {
				io.emit('error');
			} else {
               
                if(result.length != 0){
                     console.log("//////////////////",result[0].id);
                    idtut = result[0].id;
                    ChangeStatusToProgress(result[0].id,function(error,result){
                    if(error) {
                        
                    } else {
                        console.log("////////////////// balalalal "+result);

                    }
                });
                    io.emit('status',result);
                }else{
                    console.log("hahahahahahahaaaa");
                     io.emit('status',"publicite");
                }
                
                
			}
		});
      
    }, 1000);

});




io.on('ended',function(msg){

//      i = i + 1;
//      console.log("test marche depuit"+ i);
      ChangeStatusToDone(idtut,function(error,result){

			if(error) {
				
			} else {
//				io.emit("count ticket", result);
                console.log("ended",msg);
			}
		});
 

});


//var addComment = function(user,comment,callback) {
//	var self = this;
//	pool.getConnection(function(err,connection){
//		if(err) {
//			return callback(true,null);
//		} else {
//			var sqlQuery = "INSERT into ?? (??,??,??) VALUES ((SELECT ?? FROM ?? WHERE ?? = ?),?,?)";
//			var inserts = ["UserComment","UserId","UserName","Comment","UserId","User","UserName",user,user,comment];
//			sqlQuery = mysql.format(sqlQuery,inserts);
//			connection.query(sqlQuery,function(err,rows){
//				connection.release();
//				if(err) {
//					return callback(true,null);
//				} else {
//					callback(false,"comment added");
//				}
//			});
//		}
//		connection.on('error', function(err) {
//			return callback(true,null);
//        });
//	});
//}

var getDataTicket = function(callback) {
	var self = this;
	pool.getConnection(function(err,connection){
		if(err) {
			return callback(true,null);
		} else {
    
			var sqlQuery = "SELECT * FROM ?? WHERE `office_id` = "+office_id;
            
			var inserts = ["advertisements"];
			sqlQuery = mysql.format(sqlQuery,inserts);
			connection.query(sqlQuery,function(err,rows){
				connection.release();
				if(err) {
                   // console.log(err)
					return callback(true,null);
				} else {
                   console.log(rows);
					callback(false,rows);
				}
			});
		}
		connection.on('error', function(err) {
			return callback(true,null);
        });
	});
}

var CheckStatus = function(callback) {
	var self = this;
	pool.getConnection(function(err,connection){
		if(err) {
			return callback(true,null);
		} else {
   
			var sqlQuery = "SELECT id FROM ?? WHERE `raspberry_id` = 'khouloud' AND status = 'start' OR status='in_progress'";
            
			var inserts = ["office_pub"];
			sqlQuery = mysql.format(sqlQuery,inserts);
			connection.query(sqlQuery,function(err,rows){
				connection.release();
				if(err) {
                   // console.log(err)
					return callback(true,null);
				} else {
                   console.log(rows);
					callback(false,rows);
				}
			});
		}
		connection.on('error', function(err) {
			return callback(true,null);
        });
	});
}


var ChangeStatusToProgress = function(id, callback) {
	
	pool.getConnection(function(err,connection){
		if(err) {
			return callback(true,null);
		} else {

			var sqlQuery = "UPDATE ?? SET `status`= 'in_progress',`updated_at`= NOW() WHERE `id`="+id;
			var inserts = ["office_pub"];
			sqlQuery = mysql.format(sqlQuery,inserts);
			connection.query(sqlQuery,function(err,rows){
				connection.release();
				if(err) {
                    //console.log("aaaa");
					return callback(true,null);
				} else {
                   // console.log(rows);
					callback(false,rows);
				}
			});
		}
		connection.on('error', function(err) {
			return callback(true,null);
        });
	});
}

var ChangeStatusToDone = function(id, callback) {
	
	pool.getConnection(function(err,connection){
		if(err) {
			return callback(true,null);
		} else {

			var sqlQuery = "UPDATE ?? SET `status`= 'done',`updated_at`= NOW() WHERE `id`="+id;
			var inserts = ["office_pub"];
			sqlQuery = mysql.format(sqlQuery,inserts);
			connection.query(sqlQuery,function(err,rows){
				connection.release();
				if(err) {
                    //console.log("aaaa");
					return callback(true,null);
				} else {
                   // console.log(rows);
					callback(false,rows);
				}
			});
		}
		connection.on('error', function(err) {
			return callback(true,null);
        });
	});
}

var getDataTicketwaiting = function(callback) {
	var self = this;
	pool.getConnection(function(err,connection){
		if(err) {
			return callback(true,null);
		} else {

			var sqlQuery = "SELECT count(*) as num FROM ?? where  `office_id` = "+office_id;
			var inserts = ["publicite"];
			sqlQuery = mysql.format(sqlQuery,inserts);
			connection.query(sqlQuery,function(err,rows){
				connection.release();
				if(err) {
                    //console.log("aaaa");
					return callback(true,null);
				} else {
                   // console.log(rows);
					callback(false,rows);
				}
			});
		}
		connection.on('error', function(err) {
			return callback(true,null);
        });
	});
}

server.listen(3001, function(){
    console.log('Listening at port 3001');
});
