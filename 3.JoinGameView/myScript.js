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
    document.getElementById('games').innerHTML += '<div class="game" onclick="joinGame('
    + element.id + ',' + element.answer_time + ',' + element.question_time + ',' + element.creator.id +')" >'
    + element.name +'</div>'
  })

  //console.log(document.getElementsByClassName('game'));

}

function joinGame(gameid,a_time,q_time,creator) {
  localStorage.setItem('answer_time',a_time)
  localStorage.setItem('question_time',q_time)
  localStorage.setItem('creator',creator)

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

