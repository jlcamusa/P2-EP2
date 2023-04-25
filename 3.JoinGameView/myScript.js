const games = new XMLHttpRequest();

var token = localStorage.getItem('access_token')

games.open("GET","https://trivia-bck.herokuapp.com/api/games/")
games.setRequestHeader("Authorization","Bearer " + token)
games.send()

games.onload = function() {

  data = JSON.parse(this.response)
  console.log(data);
  
  Object.keys(data).forEach(element => {
    element = data[element];
    document.getElementById('games').innerHTML += '<div>'+ element.name +'</div>'
  })

  

  console.log()
}

