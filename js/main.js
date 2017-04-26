 var index = 0;
 jQuery.noConflict();
 var pim = angular.module('pim', [ 'socket.io','ngRoute' ]);


pim.factory('sock', function(){
    var socket = io.connect('http://192.168.1.3:3001')
   // console.log(socket);
    return socket;
});


pim.controller('GeneralController', ['$scope', '$interval','$http','sock' ,  function GeneralController($scope,$interval,$http, $socket,sock) {
$scope.msg = [];
$scope.TicketWaiting = 0;
$scope.tickets = [];
$scope.test = 0;
var socket = io();

var resultfetch = [];    
$scope.videosrc = "";
$scope.imagesrc = "";
var dureevid = 0;
    
var timeoutvar;
$scope.conditionsgeneral = ['screen', 'pub'];
$scope.selectiongeneral = $scope.conditionsgeneral[1];
    
   $scope.conditionsspecial = ['vid', 'imag'];
//    $scope.selectionspecial = $scope.conditionsspecial[index];
    var testind = 0;
    var waitime = 0;
  
var oldval = $scope.conditionsgeneral[1];
    
//    angular.element(document).ready(function () {
//      
//    });
    $scope.testwatch = 0;
    
     
    
    
//    
     socket.on('status',function(msg){
              console.log(msg);
              if(msg != "publicite"){
                  $scope.selectiongeneral = $scope.conditionsgeneral[0]; 
                  $scope.$apply(function(){
                      $scope.selectiongeneral = $scope.conditionsgeneral[0]; 
        });
                  $scope.testwatch = msg;
              }else{
                 $scope.selectiongeneral = $scope.conditionsgeneral[1];  
                  $scope.$apply(function(){
                      $scope.selectiongeneral = $scope.conditionsgeneral[1]; 
        });
                   $scope.testwatch = 0;
              }
         
              console.log("=================",$scope.selectiongeneral);
          });

    
    

$scope.TicketWaitings = 0;
       
             socket.on('refresh feed',function(msg){
              resultfetch = msg;
               $scope.videosrc = "video/Pim%20-%20khouloudzayati.mp4";
              $scope.imagesrc = resultfetch[0].file_path;
      
              
          });
            
    
//      socket.on('count ticket',function(msg){
//          //console.log(msg.user[0].num);
//          $scope.test = msg.user[0].num;
//      });
    
     $scope.someLoop = function() {
         console.log(resultfetch.length+"----"+resultfetch);
         console.log(resultfetch);
         if(testind < resultfetch.length){
             console.log(testind);
             console.log("111");
             console.log(resultfetch[testind]);
             console.log("111");
           if(resultfetch[testind].type == "image"){
               console.log("111222");
                console.log(resultfetch[testind].type);
               $scope.imagesrc = resultfetch[testind].file_path;
               waitime = 10000;
               $scope.selectionspecial = $scope.conditionsspecial[1];
               testind++;
               console.log($scope.conditionsspecial[1]);
               
               jQuery("#pubzone").empty();
               jQuery("#pubzone").append("<img src='"+ $scope.imagesrc+"'/>");
               console.log("+++++++++++++++++++++++",$scope.imagesrc);
               
           }else if(resultfetch[testind].type == "video"){
               console.log("111333");
                console.log(resultfetch[testind].type);
               $scope.videosrc = resultfetch[testind].file_path
               waitime = resultfetch[testind].video_length;
               $scope.selectionspecial = $scope.conditionsspecial[0];
               testind++;
              console.log($scope.conditionsspecial[0]);
              
               
               jQuery("#pubzone").empty();
                jQuery("#pubzone").append("<video autoplay controls src='"+$scope.videosrc+"' width='100%' height='100%'/>");
               console.log("+++++++++++++++++++++++",$scope.videosrc);
               
           }else{
               console.log("autre");
           }
        }else{
             console.log("222");
            testind = 0;
        }
         
         
         console.log("waiting time is ",waitime);timeoutvar =
        timeoutvar = setTimeout($scope.someLoop, waitime);
     }  

    console.log($scope.selectiongeneral);
    
//        $scope.myFunction = function(){
//            console.log("video ended and this is a test");
////            jQuery.get('localhost:3001/changestatus', function(list) {
////                $('#response').html(list); // show the list
////            });
//            socket.emit("ended","end");
//             console.log("video ended");
//        }
    
     $scope.myFunction = function(){
            console.log("video ended and this is a test");
            $.get('http://localhost:3001/changestatus', function() {
                console.log("status changed to done");
            });
        }
    
    
    
//    jQuery('#walkthr').on('ended', function(){
//         //Whatever you want to happen after it has ended
//             socket.emit("ended","end");
//             console.log("video ended");
//        });
    
    $scope.test = function() {
     if(index == 0){
        index++;
             clearTimeout(timeoutvar);
             jQuery("#pubzone").empty();
         
             testind = 0;

    }else{
        
       console.log(resultfetch.length+"----"+resultfetch);
         console.log(resultfetch);
         if(testind < resultfetch.length){
             console.log(testind);
             console.log("111");
             console.log(resultfetch[testind]);
             console.log("111");
           if(resultfetch[testind].type == "image"){
               console.log("111222");
                console.log(resultfetch[testind].type);
               $scope.imagesrc = resultfetch[testind].file_path;
               waitime = 10000;
               $scope.selectionspecial = $scope.conditionsspecial[1];
               testind++;
               console.log($scope.conditionsspecial[1]);
               
               jQuery("#pubzone").empty();
               jQuery("#pubzone").append("<img src='"+ $scope.imagesrc+"'/>");
               console.log("+++++++++++++++++++++++",$scope.imagesrc);
               
           }else if(resultfetch[testind].type == "video"){
               console.log("111333");
                console.log(resultfetch[testind].type);
               $scope.videosrc = resultfetch[testind].file_path
               waitime = resultfetch[testind].video_length;
               $scope.selectionspecial = $scope.conditionsspecial[0];
               testind++;
              console.log($scope.conditionsspecial[0]);
              
               
               jQuery("#pubzone").empty();
                jQuery("#pubzone").append("<video autoplay controls src='"+$scope.videosrc+"' width='100%' height='100%'/>");
               console.log("+++++++++++++++++++++++",$scope.videosrc);
               
           }else{
               console.log("autre");
           }
        }else{
             console.log("222");
            testind = 0;
        }
         console.log("waiting time is ",waitime);
        timeoutvar = setTimeout($scope.someLoop, waitime);
        index = 0;
    }
    $scope.selectiongeneral = $scope.conditionsgeneral[index];
    console.log($scope.videosrc+"------"+$scope.selectiongeneral);

}
    
    angular.element(document).ready($scope.someLoop);

                                     
 

}]);

