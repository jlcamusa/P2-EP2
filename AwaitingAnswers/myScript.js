
time = 20;
clock = document.getElementById('time');

var myclock = setInterval(()=>{
    time--;
    clock.innerHTML = time;

    if (time==0) {
        clock.innerHTML = time;
        clearInterval(myclock);
        window.location.href='../RateAnswersView/main.html'
    }

},1000);

