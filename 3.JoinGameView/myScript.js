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
    document.getElementById('games').innerHTML += '<div class="game" onclick="joinGame('+element.id+')" >'+ element.name +'</div>'
  })
}

function joinGame(gameid) {
  join.open('POST', 'https://trivia-bck.herokuapp.com/api/games/' + gameid + '/join_game/');
  join.setRequestHeader("Authorization","Bearer " + token);
  join.send();
}

join.onload = function() {
  localStorage.setItem('Game',JSON.parse(this.response).game_id)
  if (this.status===200){
    window.location.href='../7.WebSocket/main.html';
  }
}

