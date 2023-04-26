let token_access = localStorage.getItem('access_token')
const Game = JSON.parse(localStorage.getItem('Game'))
const main = document.getElementById('main');

let gameid = localStorage.getItem('Game');
let socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameid + "/?token=" + token_access);

socket.onopen = function(e) {
  alert("[open] Conexión establecida");
  alert("Enviando al servidor");
};

socket.onmessage = function(event) {
  alert(`[message] Datos recibidos del servidor: ${event.data}`);

  data = event.data

  console.log(data.type);

  if (data.type == "player_joined"){
    document.getElementById('rounds').min += 1
  }

};

if (localStorage.getItem('id') === localStorage.getItem('creator')) {
  
}
else {
  main.innerHTML = '<div>You are waiting</div>'; 
}
















socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`);
  } else {
    // ej. El proceso del servidor se detuvo o la red está caída
    // event.code es usualmente 1006 en este caso
    alert('[close] La conexión se cayó');
  }
};

socket.onerror = function(error) {
  alert(`[error]`);
};