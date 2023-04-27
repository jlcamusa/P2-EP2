//----- DATA -----//

let token_access = localStorage.getItem('access_token')
const Game = JSON.parse(localStorage.getItem('Game'))
const main = document.getElementById('main');

let gameid = localStorage.getItem('Game');
let socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameid + "/?token=" + token_access);

let players = [];
let faults = 0;
let points = 0;

//----- Socket methods -----//

socket.onopen = function(e) {
  console.log("[open] Conexion establecida");
};

socket.onmessage = function(event) {
  console.log(`[message] Datos recibidos del servidor: ${event.data}`);
  
  data = JSON.parse(event.data)

  switch (data.type) {
    case "player_joined":
      players.push(data.username);
      document.getElementById('rounds').min = players.length + 1;
      document.getElementById('players').innerHTML += "<li>"+ data.username +"</li>"; 
      break;
    case "round_started":
      if (data.nosy_id === parseInt(localStorage.getItem('id'))){
        document.getElementById("view_2").classList.remove("hidden");
        document.getElementById('nosy').innerHTML = "Actualmente eres el pregunton";
        localStorage.setItem("nosy","True");
      }
      else {
        document.getElementById('nosy').innerHTML = "";
        localStorage.setItem("nosy","False");
      }
      break;
    case "round_question":
      if(localStorage.getItem("nosy") === "False") {
        document.getElementById("view_3").classList.remove("hidden");
      }
      break;
    default:
      break;
  }

};

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

//----- Buttons -----//
document.getElementById('start').addEventListener('click',start);
document.getElementById('sendQuestion').addEventListener('click',sendQuestion);
document.getElementById('sendAnswer').addEventListener('click',sendAnswer)

//----- Start -----//
document.getElementById('name').innerHTML = "Nombre: " + localStorage.getItem('User')
document.getElementById('faults').innerHTML = "Faltas: " + faults
document.getElementById('points').innerHTML = "Puntos: " + points

if (localStorage.getItem('id') === localStorage.getItem('creator')) {
  document.getElementById("view_1").classList.remove("hidden")
}
else {
}

//----- Functions -----//
function start() {
  JSON_Object = { "action": "start", "rounds": document.getElementById('rounds').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_1").classList.add("hidden")
}

function sendQuestion() {
  JSON_Object = { "action": "question", "text": document.getElementById('question').value};
  socket.send(JSON.parse(JSON_Object));
  JSON_Object = { "action": "answer", "text": document.getElementById('answer').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById('view_2').classList.add("hidden")
}

function sendAnswer() {
  JSON_Object = { "action": "answer", "text": document.getElementById('userAnswer').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_3").classList.add("hidden");
}