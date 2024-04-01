chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Reload") {
        injectReloadScript();
        console.log('inject will start');
    }
});
function injectReloadScript() {
    let intervalId;
    let tabbuttonFound = false;
    const findReloadTab = () => {
        const reloadTab = document.querySelector('button[data-dd-action-name="vip-reload-tab"]');
        const progressTab = document.querySelector('button[data-dd-action-name="vip-progress-tab"]');
        if (reloadTab) {
            console.log('Reload Tab found');
            chrome.runtime.sendMessage({ type: "ReloadFound1" });
            tabbuttonFound = true;
            clearInterval(intervalId);
            ButtonLogic();
        }
        if (!tabbuttonFound && progressTab) {
            console.log('Progress Tab found but Reload Tab not found, window closing in 2 sec');
            chrome.runtime.sendMessage({ type: "NoReloadwindowsClosingin5sec" });
            clearInterval(intervalId);
            setTimeout(() => {
                window.close();
            }, 2000);
        }
    };
    findReloadTab();
    intervalId = setInterval(findReloadTab, 200);
    const progressTab = document.querySelector('button[data-dd-action-name="vip-progress-tab"]');
    setTimeout(() => {
        clearInterval(intervalId);
        if (!tabbuttonFound) {
            console.log('Reload Tab not found, window closing in 5 sec');
            chrome.runtime.sendMessage({ type: "NoReloadwindowsClosingin5sec" });
            setTimeout(() => {
                window.close();
            }, 5000);
        }
    }, 20000);
}
function ButtonLogic() {
    console.log('inject started for Button logic');
    let intervalId1;
    let ReloadbuttonFound = false;
    const findReloadButton = () => {
        const reloadButton = document.querySelector("button[type='submit']");
        if (reloadButton) {
            console.log('Reload Button found');
            chrome.runtime.sendMessage({ type: "RBFound" });
            ReloadbuttonFound = true;
            clearInterval(intervalId1);
            if (reloadButton.disabled) {
                console.log('Reload Button found but not active.');
                chrome.runtime.sendMessage({ type: "RBFoundNotActive" });
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: "RBnotactiveandFetchstarted" });
                    fetchCountdownAndSendMessage();
                }, 3000);
            } else {
                chrome.runtime.sendMessage({ type: "RBFoundActive" });
                console.log('Reload Button found and active.');
                setTimeout(() => {
                    reloadButton.click();
                    fetchNotification();
                    console.log('Reload Button clicked.');
                    setTimeout(() => {
                        fetchCountdownAndSendMessage();
                    }, 10000);
                }, 500);
            }
        }
    };
    findReloadButton();
    intervalId1 = setInterval(findReloadButton, 500);
    chrome.runtime.sendMessage({ type: "Done" });
}
function fetchCountdownAndSendMessage() {
    console.log('Countdown fetch started.');
    chrome.runtime.sendMessage({ type: "FetchStarted" });
    const checkCExist = setInterval(function() {
        let countdownTimeout;
        const countdownContainer = document.querySelector('.timer');
        if (countdownContainer) {
            chrome.runtime.sendMessage({ type: "CountDFound" });
            console.log('Countdown found');
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
                console.log('Countdown sent');
                chrome.runtime.sendMessage({ type: "CountDFoundandsent" });
                chrome.runtime.sendMessage({
                    type: "countdownContainer",
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                }, () => {
                    setTimeout(() => {
                        chrome.runtime.sendMessage({ type: "CountDFoundandsentwinclosing" });
                        window.close();
                    }, 2000);
                });
            } else {
                fetchCountdownAndSendMessage();
            }
        } else {
            countdownTimeout = setTimeout(() => {
                clearInterval(checkCExist);
                chrome.runtime.sendMessage({ type: "ReloadFinished" });
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
            console.log('Reload Notification found');
            clearInterval(checkNotificationExist);
            const ReloadnotificationText = notificationContainer.innerText.replace(/\s+/g, ' ').trim();
            chrome.runtime.sendMessage({ 
                type: "ReloadNotificationFound", 
                data: ReloadnotificationText 
            });
        }
    }, 1500);
}