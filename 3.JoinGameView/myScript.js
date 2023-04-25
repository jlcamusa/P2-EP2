const games = new XMLHttpRequest();

games.open("GET","https://trivia-bck.herokuapp.com/api/games/")
games.setRequestHeader("Authorization","Bearer " + token)
games.send()

games.onload = function() {
  console.log(JSON.parse(this.response))
}

