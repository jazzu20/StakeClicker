self.onmessage = function(event) {
    const {hours, minutes, seconds} = event.data;
    const countdownTime = Date.now() + hours*60*60*1000 + minutes*60*1000 + seconds*1000;

    function checkTime() {
        if (Date.now() >= countdownTime) {
            self.postMessage('countdownDEnded');
        } else {
            setTimeout(checkTime, 1000);
        }
    }
    checkTime();
};