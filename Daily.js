chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Daily") {
        injectDailyScript();
        console.log('inject will start');
    }
});
function injectDailyScript() {
    console.log('inject started');
    function checkForButton() {
        const buttons = document.querySelector("button[type='submit']");
        if (buttons) {
            console.log('Daily Button found.');
            if (buttons.disabled) {
                console.log('Daily Button found but not active.');
                setTimeout(() => {
                    fetchCountdownAndSendMessage();
                }, 1500);
            } else {
                console.log('Daily Button found and active.');
                buttons.click();
                setTimeout(() => {
                    buttons.click();
                    fetchNotification();
                    setTimeout(() => {
                        fetchCountdownAndSendMessage();
                    }, 10000);
                }, 500);
            }
        } else {
            setTimeout(checkForButton, 100);
        }
    }
    checkForButton();
    chrome.runtime.sendMessage({ type: "Done" });
}
function fetchCountdownAndSendMessage() {
    console.log('Daily Countdown fetch started.');
    chrome.runtime.sendMessage({ type: "DailyFetchStarted" });
    const checkCExist = setInterval(function() {
        let countdownTimeout;
        const countdownContainer = document.querySelector(".timer");
        if (countdownContainer) {
            chrome.runtime.sendMessage({ type: "DCountDFound" });
            console.log('D Countdown found');
            clearInterval(checkCExist);
            clearTimeout(countdownTimeout);
            const countdownItems = countdownContainer.querySelectorAll('.item');
            let days, hours, minutes, seconds;
            countdownItems.forEach((item, index) => {
                const valueElement = item.querySelector('.digits');
                const value = parseInt(valueElement.innerText.trim());
                switch(index) {
                    case 0:
                        if (!isNaN(value)) {
                            days = value;
                        }
                        break;
                    case 1:
                        if (!isNaN(value)) {
                            hours = value;
                        }
                        break;
                    case 2:
                        if (!isNaN(value)) {
                            minutes = value;
                        }
                        break;
                    case 3:
                        if (!isNaN(value)) {
                            seconds = value;
                        }
                        break;
                    default:
                        break;
                }
            });
            if (days !== undefined && hours !== undefined && minutes !== undefined && seconds !== undefined) {
                console.log('D Countdown sent');
                chrome.runtime.sendMessage({ type: "DCountDFoundandsent" });
                chrome.runtime.sendMessage({
                    type: "DcountdownContainer",
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                }, () => {
                    setTimeout(() => {
                        chrome.runtime.sendMessage({ type: "DCountDFoundandsentwinclosing" });
                        window.close();
                    }, 2000);
                });
            } else {
                fetchCountdownAndSendMessage();
            }
        } else {
            countdownTimeout = setTimeout(() => {
                clearInterval(checkCExist);
                chrome.runtime.sendMessage({ type: "DailyFinished" });
                window.close();
            }, 30000);
        }
    }, 100);
}

function fetchNotification() {
    console.log('Fetching notification started');
    const checkNotificationExist = setInterval(function() {
        const notificationContainer = document.querySelector(".notification-body");
        if (notificationContainer) {
            console.log('Daily Notification found');
            clearInterval(checkNotificationExist);
            const DailynotificationText = notificationContainer.innerText.replace(/\s+/g, ' ').trim();
            chrome.runtime.sendMessage({ 
                type: "DailyNotificationFound", 
                data: DailynotificationText 
            });
        }
    }, 1500);
}