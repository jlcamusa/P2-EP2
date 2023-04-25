const xhttp = new XMLHttpRequest();

function login() {
  var user = document.getElementById('User').value;
  var password = document.getElementById('Password').value;
  let JSON_OBJECT = {"username":user,"password":password}

  console.log(user)
  console.log(password)

  xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/token/");
  xhttp.setRequestHeader("Content-Type","application/json")
  xhttp.send(JSON.stringify(JSON_OBJECT));
}

document.getElementById('login').addEventListener('click',login);

xhttp.onload = function() {
  token = JSON.parse(this.response).access
  console.log(this.status)
}



