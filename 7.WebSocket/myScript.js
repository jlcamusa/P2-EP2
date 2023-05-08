//----- DATA -----//
const unjoin = new XMLHttpRequest();

let token_access = localStorage.getItem('access_token')
const Game = JSON.parse(localStorage.getItem('Game'))

let gameid = localStorage.getItem('Game');
let socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameid + "/?token=" + token_access);

let players_data = {};
let players = [];
let faults = 0;
let points = 0;
let time;
let winner;

//----- Socket methods -----//
socket.onopen = function(e) {
  console.log("[open] Conexion establecida");
};

socket.onmessage = function(event) {
  console.log(`[message] Datos recibidos del servidor: ${event.data}`);
  data = JSON.parse(event.data)

  switch (data.type) {
    case "error":
      document.getElementById('error').innerHTML = data.message
      document.getElementById('view_1').classList.remove('hidden');
      break;
    case "player_joined":
      if (!players.includes(data.username)){
        players.push(data.username);
        document.getElementById('rounds').min = players.length + 1;
        document.getElementById('players').innerHTML += "<li>"+ data.username +"</li>"; 
        document.getElementById('error').innerHTML = '';
      }      
      //TODO fix issue when selecting minimum rounds
      
      break;
    case "player_unjoined":
      //TODO fix remove player from players var
      players_data[data.userid].status = "Disconnected"
      players.splice(players.indexOf(data.username),1);
      document.getElementById('players').innerHTML = "";
      players.forEach(element => {
        document.getElementById('players').innerHTML += "<li>"+ element +"</li>"; 
      })
      update();
      break;
    case "game_started":
      data.players.forEach(element =>{
        players_data[element.userid] = {"username": element.username,"points":0,"status":"OK"};
      })
      console.log(players_data);
      update();
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

        document.getElementById("API1").innerHTML = '';

        getChatResponse(data.question).then(response => {
          document.getElementById("API1").innerHTML = response;
          }).catch(error => {
          document.getElementById("API1").innerHTML = 'ERROR';
          });      
      }
      time = parseInt(localStorage.getItem("answer_time"));
      break;
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
    case "round_result":
      Object.keys(players_data).forEach(element => {
        players_data[element].points = data.game_scores[element];
      })
      update();
      points = data.game_scores[localStorage.getItem("id")]
      document.getElementById('points').innerHTML = 'Puntos: ' + points;
    case "user_fault":
      if (data.player_id === parseInt(localStorage.getItem("id"))) {
        
        switch (data.category) {
          case "QT":
            document.getElementById('view_2').classList.add("hidden")
            faults += 2;
            break;
          case "AT":
            document.getElementById("view_3").classList.add("hidden");
            faults += 1;
            break;
          case "ET":
            document.getElementById("view_4").classList.add("hidden");
            faults += 1;
            break;
          case "FT":
            document.getElementById("view_5").classList.add("hidden");
            faults += 1;
            break;
          case "FF":
            faults += 1;
            break;
          default:
            break;
        }
        document.getElementById('faults').innerHTML = "Faltas: " + faults;
      }
      break;
    case "user_disqualified":
      if (data.player_id === parseInt(localStorage.getItem("id"))) {
        unjoin.open("POST","https://trivia-bck.herokuapp.com/api/games/gameid/unjoin_game/");
  	    unjoin.setRequestHeader("Authorization","Bearer " + token_access);
  	    unjoin.send();
        alert('Has sido descalificado');
        window.location.href='../3.JoinGameView/main.html';
      }
      players_data[data.player_id].status = "Disqualified"
      update();
      break;
    case "game_canceled":
      alert('El juego ha sido cancelado')
      break;
    case "game_deleted":
      alert('El juego ha sido eliminado')
      break;
    case "game_result":
      document.getElementById("view_6").classList.remove('hidden');
      Object.keys(players_data).forEach(element =>{
        players_data[element].points = data.game_scores[element];
      })

      order = Object.entries(players_data).sort((a,b) => b[1].points - a[1].points);
      order.forEach(element => {
        document.getElementById('winners').innerHTML += '<div>' + 
        element[1].username + ' : ' +
        element[1].points +
        '</div>'
      })
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

if ( localStorage.getItem('players') != '') {
  JSON.parse(localStorage.getItem('players')).forEach(element => {
  if (localStorage.getItem('User') != element.username) {
    document.getElementById('players').innerHTML += "<li>"+ element.username +"</li>";
    players.push(element.username);
  }
  })
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
  document.getElementById('view_2').classList.add("hidden");
}

function sendAnswer() {
  JSON_Object = { "action": "answer", "text": document.getElementById('userAnswer').value};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_3").classList.add("hidden");
}

function sendQualify() {
  document.querySelectorAll(".userQualify").forEach(element=>{
    data = element.value.split(',');
    JSON_Object = { "action": "qualify", "userid": data[1],"grade": data[0]};
    socket.send(JSON.stringify(JSON_Object));
  })
  document.getElementById("evaluateAnswers").innerHTML = "";
  document.getElementById("view_4").classList.add("hidden");
  time = 30;    
}

function sendReview() {
  data = document.querySelector('input[name="review"]:checked').value;
  JSON_Object = { "action": "assess", "correctness": data};
  socket.send(JSON.stringify(JSON_Object));
  document.getElementById("view_5").classList.add("hidden");
}

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

function update() {
  document.getElementById('players').innerHTML = '';
  Object.keys(players_data).forEach(element => {
    document.getElementById('players').innerHTML += '<li class="user_info">' +
    '<div>'+ players_data[element].username + '</div>' +
    '<div>'+ players_data[element].points + '</div>' +
    '<div>'+ players_data[element].status + '</div>' +
    '</li>'
  })
}

function getChatResponse(prompt) {
  const API_KEY = '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'; // Reemplaza "tu_clave_api" con tu clave API
  const url = 'https://api.openai.com/v1/completions';
return new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
  request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
      const response = JSON.parse(request.responseText);
      resolve(response.choices[0].text.trim());
  } else {
      reject(request.statusText);
  }
  };
  request.onerror = () => {
  reject('Error de red');
  };
  request.send(JSON.stringify({
  "model": "text-davinci-003",
  prompt: prompt,
  max_tokens: 100,
  temperature: 0.5,
  }));
});
}

async function searchMovies(query) {
  const API_URL = 'http://www.omdbapi.com/?apikey=42fa4060&type=movie&s=';
  const response = await axios.get(`${API_URL}${query}`);
  const results = response.data.Search.map((result) => ({
    id: result.imdbID,
    title: result.Title,
    year: result.Year,
    poster: result.Poster
  }));
  return results;
}