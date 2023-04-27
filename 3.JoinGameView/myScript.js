const games = new XMLHttpRequest();
const join = new XMLHttpRequest();

var token = localStorage.getItem('access_token')

games.open("GET","https://trivia-bck.herokuapp.com/api/games/")
games.setRequestHeader("Authorization","Bearer " + token)
games.send()

games.onload = function() {
  data = JSON.parse(this.response)
  console.log(data);
  
  Object.keys(data).forEach(element => {
    element = data[element];
    document.getElementById('games').innerHTML += '<div class="game">'+ element.name +'</div>';
  })

  index = 0;
  Object.keys(data).forEach(element => {
    element = data[element];
    document.querySelectorAll(".game")[index].addEventListener('click', () => {joinGame(element)});
    index += 1
  })

}

function joinGame(game) {
  localStorage.setItem('answer_time',game.answer_time)
  localStorage.setItem('question_time',game.question_time)
  localStorage.setItem('creator',game.creator.id)

  join.open('POST', 'https://trivia-bck.herokuapp.com/api/games/' + game.id + '/join_game/');
  join.setRequestHeader("Authorization","Bearer " + token);
  join.send();
}

join.onload = function() {
  localStorage.setItem('Game',JSON.parse(this.response).game_id)
  if (this.status===200){
    window.location.href='../7.WebSocket/main.html';
  }
}

