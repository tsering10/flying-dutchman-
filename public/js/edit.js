function editAccount() {
    var firstName = document.getElementById('name');
    var surname = document.getElementById('surname');
    var emailAddress = document.getElementById('email');
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var phoneNumber = document.getElementById('phone');

    var url = "http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=user_edit&=new_username="+username+
    																								   "&=new_password="+password+
    																								   "&=first_name="+firstName+
    																								   "&=last_name="+surname+
    																								   "&=email="+emailAddress+
    																								   "&=phone="+phoneNumber+"";
    																								   
    httpGet(url);																								   
   
}

function httpGet(theURL){
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open("GET", theURL, false);
    xmlHttp.send(null);
    
    //return xmlHttp.responseText;
}