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
let time;

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
      if (data.nosy_id === parseInt(localStorage.getItem('id'))){
        document.getElementById("view_2").classList.remove("hidden");
        document.getElementById('nosy').innerHTML = "Actualmente eres el pregunton";
        localStorage.setItem("nosy","True");
      }
      else {
        document.getElementById('nosy').innerHTML = "";
        localStorage.setItem("nosy","False");
      }

      time = parseInt(localStorage.getItem("question_time"));
      break;
    case "round_question":
      if(localStorage.getItem("nosy") === "False") {
        document.getElementById("view_3").classList.remove("hidden");
        document.getElementById("roundQuestion").innerHTML = data.question;
      } 
      time = parseInt(localStorage.getItem("answer_time"));
      break;
    //TODO
    case "round_answer":
      data.userid;
      document.getElementById("evaluateAnswers").innerHTML += '<div>'+
        '<div>'+ data.answer +'</div>'+
        '<div><select class="userQualify">'+
        '<option value=' + 0 + ',' + data.userid + '>Mala</option>'+
        '<option value=' + 1 + ',' + data.userid + '>Mas o Menos</option>'+
        '<option value=' + 2 + ',' + data.userid + '>Buena</option>'+
        '</select></div>'+
        '</div>'
      break;
    case "answer_time_ended":
      if (localStorage.getItem("nosy") === "True"){
        document.getElementById("view_4").classList.remove("hidden");
      }
      time = 90;
      break;
    case "round_review_answer":
      if (localStorage.getItem("nosy") === "False"){
        document.getElementById("view_5").classList.remove("hidden");

        evaluation = grade(data.grade);

        console.log(data.grade);
        document.getElementById("reviewAnswers").innerHTML = "<div>"+
          "<div>RESPUESTA CORRECTA: " + data.correct_answer + "</div>" +
          "<div>RESPUESTA ENTREGADA: " + data.graded_answer + "</div>" +
          "<div>EVALUACION: " + evaluation + "</div>" +
          "<label for=''></label>" +
          "<div>" +
          '<input id="1" type="radio" value="true" name="review" checked>' +
          '<label for="1">True</label>' +
          '<input id="2" type="radio" value="false" name="review">' +          
          '<label for="2">False</label>' +
          "</div>" +
          "</div>"
        
      }
      time = 30;
      break;

    case "game_result":
      break;
    case "user_falut":
      if (data.player_id === parseInt(localStorage.getItem("id"))) {
        switch (data.category) {
          case "":
            faults += 2
            break;
          default:
            faults += 1
            break;
        }
        
        document.getElementById('faults').innerHTML = "Faltas: " + faults;
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
document.getElementById('sendReview').addEventListener('click',sendReview);

//----- Start -----//
document.getElementById('name').innerHTML = "Nombre: " + localStorage.getItem('User')
document.getElementById('faults').innerHTML = "Faltas: " + faults
document.getElementById('points').innerHTML = "Puntos: " + points

if (localStorage.getItem('id') === localStorage.getItem('creator')) {
  document.getElementById("view_1").classList.remove("hidden")
}
else {
}

document.getElementById("clock").innerHTML = localStorage.getItem("question_time");
setInterval(clock,1000);

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
    data = element.value.split(',');

    JSON_Object = { "action": "qualify", "userid": data[1],"grade": data[0]};
    socket.send(JSON.stringify(JSON_Object));
  })
  document.getElementById("evaluateAnswers").innerHTML = "";
  document.getElementById("view_4").classList.add("hidden");    
}

function sendReview() {
  //TODO
  data = document.querySelector('input[name="review"]:checked').value;
  JSON_Object = { "action": "assess", "correctness": data};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_5").classList.add("hidden");
}

//UNUSED
function grade(number) {
  switch (number) {
    case 0:
      return "Mala"
    case 1:
      return "Mas o Menos"
    case 2:
      return "Buena"
    default:
      break;
  }
}

function clock() {
  if (time > 0){
    time --;
    document.getElementById("clock").innerHTML = time;
  }
}