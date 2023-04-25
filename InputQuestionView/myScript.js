
time = 120;
clock = document.getElementById('time');

var myclock = setInterval(()=>{
    time--;
    clock.innerHTML = time;

    if (time==0) {
        clock.innerHTML = time;
        clearInterval(myclock);
    }

},1000);

