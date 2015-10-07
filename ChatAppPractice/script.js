// Messaging app: Written by Keigo Ito

// Variables definition
var counter = 0, latest = "";


// AJAX GET Call
var ajaxGet = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://ccchatapp.firebaseio.com/message/.json", true); // Creating a GET Ajax call to the firebase database.
    xhr.send();
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {  // If the Ajax call was successful...
            display(JSON.parse(this.response));         // then parse the JSON result
        } else {
            console.log("GET failed.")                  // else console out the error message.
        }
    };
}

function display(response) {                            // The method to display message.
    var htmlStr = "";
    var arrData = [];
    for (var i in response) {
        var message = response[i].message;              // Populating the local variables with the response from the database.
        var timeUnformatted = response[i].time;
        var time = new Date(timeUnformatted);
        var name = response[i].name;
        var messageObj = { id: i, name: name, message: message, time: time };   // and creating an object to display.
        arrData.unshift(messageObj);
    }
    if (arrData[0].id != latest) {                      // Check if the id is "latest". If not, display message.
        for (var i = 0; i < arrData.length; i++) {      // Loops the array 

            //htmlStr += "<p>At " + time + ", " + arrData[i].name + " said:<br/>";  // This line will print out the date and time of the message entry. Removed because it appears quite messy
            htmlStr += "<p>" + arrData[i].name + " said:<br/>";
            htmlStr += arrData[i].message + "<br/><br/>**********" + "</p>"
            latest = arrData[0].id;
        }
        $("#output").html(htmlStr);
    }
}

ajaxGet();

// CREATE ajax call
function ajaxCreate(newPost) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ccchatapp.firebaseio.com/message/.json", true);
    xhr.send(JSON.stringify(newPost));
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            ajaxGet();
        } else { console.log("Create failed"); }
    }
    
}

$("#submit").click(function () {                        // Click event function
    var name = $("#name").val();                        // Populating the variables with inputs from a user
    var message = $("#input").val();
    var time = event.timeStamp;
    var msgToPost = { name: name, message: message, time: time };   // Creating a message object to be sent.
    ajaxCreate(msgToPost);  
    $("#input").val("");                                            // Initializing the text fields. 
}) 


setInterval(ajaxGet, 1000);                             // Polling with the 1 sec interval. 

