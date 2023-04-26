let token_access = localStorage.getItem('access_token')
const Game = JSON.parse(localStorage.getItem('Game'))

let gameid = Game.id

const socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameid + "/?token=" + token_access);

socket.addEventListener("message", (event) => {
    console.log("Message from server", event.data);
})