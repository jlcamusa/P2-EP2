//----- DATA -----//
const unjoin = new XMLHttpRequest();

let token_access = localStorage.getItem('access_token')
const Game = JSON.parse(localStorage.getItem('Game'))

let gameid = localStorage.getItem('Game');
let socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameid + "/?token=" + token_access);

//TODO fix player
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
      //TODO
      document.getElementById('rounds').min = players.length + 1;
      document.getElementById('players').innerHTML += "<li>"+ data.username +"</li>"; 
      break;
    case "player_unjoined":
      players.splice(players.indexOf(data.username),1);
      document.getElementById('players').innerHTML = "";
      players.forEach(element => {
        document.getElementById('players').innerHTML += "<li>"+ element +"</li>"; 
      })
      break;
    case "round_started":
      console.log(data.nosy_id);
      console.log(localStorage.getItem("id"));
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
        document.getElementById("roundQuestion").innerHTML = data.question;
      }
      break;
    //TODO
    case "round_answer":
      data.userid;
      document.getElementById("evaluateAnswers").innerHTML += '<div>'+
        '<div>'+ data.answer +'</div>'+
        '<div><select class="userQualify">'+
        '<option value="{"id":'+ data.userid +', "points": 0}">Mala</option>'+
        '<option value="{"id":'+ data.userid +', "points": 1}">Mas o Menos</option>'+
        '<option value="{"id":'+ data.userid +', "points": 2}">Buena</option>'+
        '</select></div>'+
        '</div>'
      break;
    case "answer_time_ended":
      if (localStorage.getItem("nosy") === "True"){
        document.getElementById("view_4").classList.remove("hidden");
      }
      break;

    case "game_result":
      break;
    case "user_falut":
      if (data.player_id === localStorage.getItem("id")) {
        //TODO caso faltas especificas 
        faults += 1;
        document.getElementById('faluts').innerHTML = "Faltas: " + faults;
      }
      if (faults >= 3) {
        unjoin.open("POST","https://trivia-bck.herokuapp.com/api/games/gameid/unjoin_game/");
  	    unjoin.setRequestHeader("Authorization","Bearer " + token_access);
  	    unjoin.send();
        alert('Has sido descalificado');
        window.location.href='../3.JoinGameView/main.html';
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
document.getElementById('sendAnswer').addEventListener('click',sendAnswer);
//TODO
document.getElementById('sendQualify').addEventListener('click',sendQualify);

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
  socket.send(JSON.stringify(JSON_Object));
  JSON_Object = { "action": "answer", "text": document.getElementById('answer').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById('view_2').classList.add("hidden")
}

function sendAnswer() {
  JSON_Object = { "action": "answer", "text": document.getElementById('userAnswer').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_3").classList.add("hidden");
}

//TODO
function sendQualify() {

  document.querySelectorAll(".userQualify").forEach(element=>{
    data = JSON.parse(element.value);

    JSON_Object = { "action": "qualify", "userid": data.id,"grade": data.points};
    socket.send(JSON.stringify(JSON_Object));
  })
  document.getElementById("evaluateAnswers").innerHTML = "";
  document.getElementById("view_4").classList.add("hidden");    
}