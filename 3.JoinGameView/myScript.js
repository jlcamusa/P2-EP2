const games = new XMLHttpRequest();

var token = localStorage.getItem('access_token')

games.open("GET","https://trivia-bck.herokuapp.com/api/games/")
games.setRequestHeader("Authorization","Bearer " + token)
games.send()

games.onload = function() {

  //document.getElementById('games').innerHTML = '<div></div>'
  console.log(JSON.parse(this.response))
}

