//----- XMLHttp -----//
const games = new XMLHttpRequest();
const join = new XMLHttpRequest();

//----- Data -----//
var token = localStorage.getItem('access_token');

//----- Start -----//
games.open("GET","https://trivia-bck.herokuapp.com/api/games/");
games.setRequestHeader("Authorization","Bearer " + token);
games.send();

//----- onload -----//
games.onload = function() {
  data = JSON.parse(this.response)
  console.log(data);
  
  Object.keys(data).forEach(element => {
    element = data[element];
    document.getElementById('games').innerHTML += '<div class="game">'+ element.name + 
    '<span class="right">' + element.players.length + '/12' +'</span></div>';
  })

  index = 0;
  Object.keys(data).forEach(element => {
    element = data[element];
    document.querySelectorAll(".game")[index].addEventListener('click', () => {joinGame(element)});
    index += 1
  })
}

join.onload = function() {
  localStorage.setItem('Game',JSON.parse(this.response).game_id)
  if (this.status===200){
    window.location.href='../7.WebSocket/main.html';
  }
}

//----- Functions -----//
function joinGame(game) {
  token = localStorage.getItem('access_token');
  localStorage.setItem('answer_time',game.answer_time);
  localStorage.setItem('question_time',game.question_time);
  localStorage.setItem('creator',game.creator.id);
  localStorage.setItem('players', JSON.stringify(game.players));

  //TODO guardar jugadores
  join.open('POST', 'https://trivia-bck.herokuapp.com/api/games/' + game.id + '/join_game/');
  join.setRequestHeader("Authorization","Bearer " + token);
  join.send();
}