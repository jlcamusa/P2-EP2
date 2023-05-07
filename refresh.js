//----- XMLHttp -----//
const refresh = new XMLHttpRequest();

//----- Data -----//
const JSON_OBJECT = {"refresh": localStorage.getItem("refresh_token")};
var token

//----- Start -----//
update_token();
setInterval(update_token,300000);

//----- onload -----//
refresh.onload = function() {
    data = JSON.parse(this.response)
    localStorage.setItem('access_token',data.access);
  }

//----- Function -----//
function update_token() {
    refresh.open("POST", "https://trivia-bck.herokuapp.com/api/token/refresh/");
    refresh.setRequestHeader("Content-Type","application/json");
    refresh.send(JSON.stringify(JSON_OBJECT));
  }