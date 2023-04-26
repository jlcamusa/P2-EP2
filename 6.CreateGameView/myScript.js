const xhttp = new XMLHttpRequest();

function newGame() {
    let name = document.getElementById('name').value;
    let questionTime = document.getElementById('questionTime').value;
    let answerTime = document.getElementById('answerTime').value;

    let JSON_OBJECT = {'name': name, 'question_time': questionTime, 'answer_time': answerTime};

    console.log(JSON_OBJECT);

    let token = localStorage.getItem('access_token');

    xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/games/");
    xhttp.setRequestHeader("Authorization","Bearer " + token)
    xhttp.setRequestHeader("Content-Type","application/json")
    xhttp.send(JSON.stringify(JSON_OBJECT));
}

xhttp.onload = function() {
    if (this.status === 201) {
        localStorage.setItem( 'Game', JSON.parse(this.response).id ) ;
        window.location.href='../7.WebSocket/main.html';
    }
}

document.getElementById('create').addEventListener('click',newGame);
