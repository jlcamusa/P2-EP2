// Create an XMLHttpRequest object
const xhttp = new XMLHttpRequest();

let JSON_OBJECT = {"username":"G11_Camus","password":"password"}

// Define a callback function
xhttp.onload = function() {
  // Here you can use the Data
  console.log(this.response)
}

// Send a request
xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/token/");
xhttp.setRequestHeader("Content-Type","application/json")
xhttp.send(JSON.stringify(JSON_OBJECT));