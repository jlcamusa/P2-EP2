const xhttp = new XMLHttpRequest();

function login() {
  var user = document.getElementById('User').value;
  var password = document.getElementById('Password').value;
  let JSON_OBJECT = {"username":user,"password":password}

  localStorage.setItem('User',user)
  localStorage.setItem('User',password)

  xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/token/");
  xhttp.setRequestHeader("Content-Type","application/json")
  xhttp.send(JSON.stringify(JSON_OBJECT));
}

document.getElementById('login').addEventListener('click',login);

xhttp.onload = function() {
    if (this.status === 200) {
        localStorage.setItem('access_token',JSON.parse(this.response).access)
        window.location.href='../2.HomeView/main.html';
    }
}
   