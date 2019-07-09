$(document).ready(OnReady);

function editAccount() {
    $("#addAccount").hide();
    $("#deleteAccount").hide();
    $("#editAccount").show();
    $("#addCredit").hide();
}

function addAccount() {
    //$("#stuff").empty();
    //$("#editAccount").attr( "title", inputTitle );
    $("#editAccount").hide();
    $("#deleteAccount").hide();
    //$("#stuff").append($("#addAccount"));
    $("#addAccount").show();
    $("#addCredit").hide();
}

function deleteAccount() {
    //$("#stuff").empty();
    //$("#editAccount").attr( "title", inputTitle );
    $("#editAccount").hide();
    //$("#stuff").append($("#addAccount"));
    $("#addAccount").hide();
    $("#deleteAccount").show();
    $("#addCredit").hide();
}

function addCredit() {
    $("#addAccount").hide();
    $("#deleteAccount").hide();
    $("#editAccount").hide();
    $("#addCredit").show();
}

function OnReady(){
	payment();
	searchString();
	setInterval(animation, 30); // calls animation() every 30 miliseconds until stopped
}

/*
 * function beer()
 * Description : make appear the first div and disappear the second one
 */
function switchDisplay(id1, id2){
    var defaut = document.getElementById(id1);
    var autre = document.getElementById(id2);
    defaut.style.display = (defaut.style.display == 'none' ? '' : 'none');
    autre.style.display = (autre.style.display == 'none' ? '' : 'none');
}

/*
 * function back_drag()
 * Description :Change the background of receipt with picture drag and drop
 */
function back_drag(){
	var elmt = document.getElementById("bill");
	// Adding backround drag and drop
	elmt.style.backgroundImage = "url('../img/draganddrop.png')";
	elmt.style.backgroundSize= "100% 360px";
	elmt.style.backgroundPositionY= "30px";
}

/*
 *function beer()
 * Description :Load the list of beer from the API
 */
function beer(){
	$.getJSON('/beers', 
	function(json_obj) {
      // Replace buttons by list of beer
	  switchDisplay('Button1', 'Button2');
	  var element = document.getElementById('add_drink');
	 
	  // If list of beer hasn't been added previously
	  if (element == null) {
	    var number = 1;
	    for (i = 0; i < json_obj.length; i++) 
	    { 
	      if(json_obj[i].namn != "")
	      {
	      	//Creating of the list of beer into a table
	      $('#table1').append('<tr id="t'+number+'" class="beer" draggable="true" ondragstart="drag(event,'+number+')"><th scope="row">'+number+
	        '</th><td><img src="../img/beer_png.png" style="width:64px; height:64px;" />'+
	        '</th><td>' +json_obj[i].namn+ 
	          (json_obj[i].namn2 == "" ? "":" ("+json_obj[i].namn2+")")+
	        '</td><td style="display:none;">' +json_obj[i].sbl_price+
	        '</th><td style="display:none;">' +json_obj[i].pub_price+
	        '</td><td style="display:none;">' +json_obj[i].beer_id+
	        '</td><td>' +json_obj[i].count+
	        '</td><td>' +json_obj[i].price+
	        '</td><td><button type="button" class="btn btn-default"  onclick="description('+number+');">'+
	        '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>'+
	        '</button></td></tr>');
	      number++;
	      }//if2
	    }//for
	  }//if1*/ 
	});
	//Adding of background Drag and Drop
	back_drag();
}//beer

/*
 * function add_drink(numberId)
 * Description : add drink to the receipt after a drag and drop is made by a user
 */
function add_drink(numberId) 
{
	var Name = document.getElementById('t'+numberId).cells[2].innerHTML;
    var Price = document.getElementById('t'+numberId).cells[7].innerHTML;
	var Id  = document.getElementById('t'+numberId).cells[5].innerHTML;
    var row = document.getElementById('tt'+numberId+'');
    var count  = document.getElementById('t'+numberId).cells[6].innerHTML;
	 
	 // If beer has been add previously
	 if(row!=null){
	  	alert("it has been already add in your order!");
	  	
	  }
	  // If count of beer is equal to zero
	  else if(count <= 0){
	    alert("Out of stock! Sorry");
	   
	  }
	  else{
	  	//adding of the beer in the receipt
	  	$('#table2').append('<tr id="tt'+numberId+'"><th scope="row">'+numberId+
	        '</th><td>' +Name+
	        '</td><td>' +Price+
	        '</td><td style="display:none;">' +Id+
	        '</th><td  id="quantity" >1</td>'+
	        '<td><button type="button" class="btn btn-default"  onclick="quantityP('+numberId+');">'+
	        '<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>'+
	        '</button></td>'+
	        '<td><button type="button" class="btn btn-default"  onclick="quantityM('+numberId+');">'+
	        '<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>'+
	        '</button></td>'+
	        '<td><button type="button" class="btn btn-default"  onclick="removeP('+numberId+');">'+
	        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
	        '</button></td>'+
	        '</tr>');
	    // updating of the total price    
	  	total(Price);
	  		 
	    // Remove the background drag and drop
	    var elmt = document.getElementById("bill");
		elmt.style.backgroundImage = "";
		
		// Enable to clean stack when you add a new beer
		$(".save").attr("disabled", false);
	  }

}


/*
 * function quantityP(numberId)
 * Description : increase quantity of a beer in receipt
 */
function quantityP(numberId)
{
	var quantity = document.getElementById('tt'+numberId+'').cells[4].innerHTML;
	var price = document.getElementById('tt'+numberId+'').cells[2].innerHTML;
	quantity++;
	$('#table2 #tt'+numberId+' #quantity').html(quantity);
	//updating of the total price
	total(price);
}


/*
 * function quantityM(numberId)
 * Description : decrease quantity of a beer in receipt
 */
function quantityM(numberId){

	var quantity = document.getElementById('tt'+numberId+'').cells[4].innerHTML;
	var price = document.getElementById('tt'+numberId+'').cells[2].innerHTML;
    quantity--;

	if(quantity==0){
		$('#table2 #tt'+numberId+'').remove();
		// adding of the background Drag and Drop
		back_drag();
	}
	else{
		$('#table2 #tt'+numberId+' #quantity').html(quantity);
	}
	//updating of the total price
	total(-price);
}


/*
 * function removeP(numberId)
 * Description : remove a beer to the receipt
 */
function removeP(numberId)
{
	var quantity = document.getElementById('tt'+numberId+'').cells[4].innerHTML;
	var price = document.getElementById('tt'+numberId+'').cells[2].innerHTML;
	// number * price of beer removed to the receipt
	var result = parseFloat(''+price+'') * parseFloat(''+quantity+'');
	//updating of the total price
	total(-result);
	$('#table2 #tt'+numberId+'').remove();
	//add the removed line in the array stuff for Undo Redo
    stuff.push(numberId);
	if(document.getElementById('ttotal')==null)
	{
		// adding of the background Drag and Drop
		back_drag();	
	}
}


/*
 * function total(value)
 * Description : calculating the total value of the order
 */
function total(value){

	var element = document.getElementById('ttotal');

	// If balise hasn't been add previously
	if (element!=null) {
		var total = document.getElementById('ttotal').cells[0].innerHTML;
		//add of two float xx.90 + yy.10 
		value = parseFloat(''+total+'') + parseFloat(''+value+'');
		//keep only two numbers after .
		value = value.toFixed(2);
		// if total == 0
		if(value==0){
			$('#table3 #ttotal').remove();
			// make the button Payment disabled
			$('.payment.buttonD').attr("disabled", true);
		}
		else{
			// else updating of the total price
			$('#table3 #ttotal #total_value').html(value);
			//make the button Payment clickable
		    $('.payment.buttonD').attr("disabled", false);
		}
	}
	// else the total doesn't exist, add the new value like total price
	else
	{
		$('.payment.buttonD').attr("disabled", false);
		$('#table3').append('<tr id="ttotal"><td id="total_value">'+value+'</td></tr>');
	}
}

/*
 * function payment()
 * Description : Gets the invoice for the order and summary
 */
function payment() {
	$( ".payment" ).click(function() {
		var element = document.getElementById('final_recipe');
		var size_table = $('#table2 tbody tr').length;
	    var array = document.getElementById("table2").rows;
		var name, price, quantity, id;
		var total = document.getElementById("total_value").innerHTML;
		
		if(element!=null)
		{
			//clean the text in the popup if it already exists
			$( "#popup_text" ).empty();
		}
	
		$('#popup_text').html( '<p id="final_recipe">You want :</p>' );
		
		// REcovery of beers in the receipt to make it in the popup	
		for(i=1; i<=size_table; i++)
		{
			name = array[i].cells[1].innerHTML;
			quantity = array[i].cells[4].innerHTML;
			
			$('#popup_text').append('<p class="pop">'+quantity+' x '+name+'</p>');
					  	
		}
		$('#popup_text').append('<p class="pop finalTot">Total : '+total+'</p>');
	
	});
}

/*
 * function submit_Total()
 * Description : send the total value from a Json object to the API
 */
function submit_Total()
{
	var size_table = $('#table2 tbody tr').length;
	var array = document.getElementById("table2").rows;
    var name, price, quantity, id;
	var total = document.getElementById("total_value").innerHTML;
	var result = parseFloat(''+price+'') * parseFloat(''+quantity+'');
	  
    var jsonTotal = {"order" : 0 , "items" : [] };
	var line = {"id": 0, "quantity" : 0, "total": 0};
	 
	// Recovery from the receipt and creating of the Json file
	for(i=1; i<=size_table; i++)
	 {
		  	name = array[i].cells[1].innerHTML;
		  	price = array[i].cells[2].innerHTML; 
		  	id = array[i].cells[3].innerHTML;
		  	quantity = array[i].cells[4].innerHTML;
			
			// putting of attributes into the Json file
		  	line.id = id;
		  	line.quantity = quantity;
		  	line.total = result;
		  	
		  	jsonTotal.items.push(line);
	 }
	  
	 jsonTotal.order=total;
	 
	 // sending json file to the /placeorder
	 $.ajax({
	    type: "POST",
	    contentType: "application/json; charset=utf-8",
	    url: '/placeorder',
	    data: JSON.stringify(jsonTotal),
	    dataType: "json",
	    success: function (msg) {
	        $( "div#popup_text" ).replaceWith( "<div id='popup_text'><h1>Your order has been recorded, Thank you!</h1></div>" );
	        // emptying of the receipt
	        $( "#table2 tbody" ).empty();
	        // emptying of the total
	        $( "#table3 tbody" ).empty();
	        
	    },
	    error: function (err){
	    	$( ".modal-content" ).replaceWith( "<div class='alert alert-danger alert-dismissible fade in' role='alert'>"+
	    										"<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>"+
	    										"<h4>Oh snap! You got an error!</h4></div>" );
    	}

	});
	 
}

/*
 * function searchString()
 * Description : search a string in the list of beer dynamically
 */
function searchString() {
	// releasing of the key written by user into the input
	$("#mySearch").keyup(function(e)
	{
	  // Convert the string to lowercase letters and split the string into words
	  var words = $(this).val().toLowerCase().split(" ");
	  $("#table1 tbody tr").each(function(index, tr)
	  {
	      if (words[0].length > 0) $(tr).hide(); else $(tr).show();
	      $("td", tr).each(function(index, td)
	      { 
	          for (word in words)
	          {
	          	// if the letter is contained in a tr show it
	            if (words[word].length > 0 && $(td).text().toLowerCase().indexOf(words[word])>= 0)
	            {
	              $(tr).show();
	              return false;
	            }
	        }
	      });
	  });
	});
}

/*
 * function allowDrop(ev), drag(ev, number), drop(ev, number)
 * Description : allow to drag and drop a beer from the list to the receipt
 */
 
function allowDrop(ev) {
	// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
    ev.preventDefault();
}

function drag(ev, number) {
    ev.dataTransfer.setData("text", ev.target.id);
    // sending the function drop() with the id of the line in parameters into the div bill
    $('#bill').attr('ondrop','drop(event, '+number+')');
}

function drop(ev, number) {
    ev.preventDefault();
    // when it is dragged into the target, reusing of the function add_drink()
    add_drink(''+number+'');
}


/*
 * function animation()
 * Description : make an animation on the logo
 */
var degrees = 0;

function animation(){
	var elem = document.getElementById('beer_img');
	if(navigator.userAgent.match("Chrome")){
		elem.style.WebkitTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Firefox")){
		elem.style.MozTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("MSIE")){
		elem.style.msTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Opera")){
		elem.style.OTransform = "rotate("+degrees+"deg)";
	} else {
		elem.style.transform = "rotate("+degrees+"deg)";
	}
	degrees++;
	
	if(degrees > 359){
		degrees = 1;
	}
}



