/**
 * Order Service
 */

var Q = require('q');
var request = require('request');


function OrderService() {
	this.placeOrder = placeOrder;

	
}

/*
* Call this for each order
*/


function purchase(req,item){
 
 var deferred = Q.defer();
 
  var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' + req.user.username.trim() +
            '&password=' + req.user.password.trim() +'&action=purchases_append&beer_id=' + item.beer_id;
        //if(username=="aji") {

        request(url, function(err, resp, body) {
            body = JSON.parse(body);

            //TODO show the correct message to the user
            if (body.type == 'error') {
                console.log("failed to do purchase");
                
                deferred.reject(new Error({'error':"Error in doing the purchase"}));
                
            } else {
                var beers = body.payload;
                console.log("beers one id" + body.payload[0].beer_id)

                 deferred.resolve({});
            }

        });
        
    return deferred.promise;    
}

function placeOrder(order,req) {
    
    var deferred = Q.defer();
	

	    var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' + req.user.username.trim() + '&password=' + req.user.password.trim() +'&action=inventory_get';
        //if(username=="aji") {

        request(url, function(err, resp, body) {
            body = JSON.parse(body);

            //TODO show the correct message to the user
            if (body.type == 'error') {
                console.log("failed to get beers");
                
                deferred.reject(new Error({'error':"Error in placing the order"}));
                
            } else {
                var beers = body.payload;
                console.log("beers one id" + body.payload[0].beer_id)

                 deferred.resolve({});
            }

        });
	
	
	
	return deferred.promise;
}



module.exports = OrderService;