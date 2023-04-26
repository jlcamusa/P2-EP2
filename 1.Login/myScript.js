const xhttp = new XMLHttpRequest();
const user = new XMLHttpRequest();

function login() {
  var user = document.getElementById('User').value;
  var password = document.getElementById('Password').value;
  let JSON_OBJECT = {"username":user,"password":password}

  localStorage.setItem('User',user);

  xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/token/");
  xhttp.setRequestHeader("Content-Type","application/json")
  xhttp.send(JSON.stringify(JSON_OBJECT));
}

document.getElementById('login').addEventListener('click',login);

xhttp.onload = function() {
    if (this.status === 200) {
      token = JSON.parse(this.response)
      localStorage.setItem('access_token', token.access);
      localStorage.setItem('refresh_token',token.refresh);
      user.open('GET', 'https://trivia-bck.herokuapp.com/api/profile/')
      user.setRequestHeader("Authorization","Bearer " + token.access)
      user.send()
    }
}

user.onload = function() {
  if (this.status === 200) {
    localStorage.setItem('id',JSON.parse(this.response).id)
    window.location.href='../2.HomeView/main.html';
  }
}      