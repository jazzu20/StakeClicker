chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "Bonus") {
    injectBonusScript();
  }
});
function injectBonusScript() {
    let intervalId2;
    let BonusbuttonFound = false;
    const findBonusButton = () => {
        const Bonusbutton = document.querySelector("button[type='submit']");
        if (Bonusbutton) {
            console.log('Bonus Button found');
            chrome.runtime.sendMessage({ type: "BonusButtonfound" });
            BonusbuttonFound = true;
            clearInterval(intervalId2);
            ButtonLogic();
        }
    };
    findBonusButton();
    intervalId2 = setInterval(findBonusButton, 100);
    setTimeout(() => {
        clearInterval(intervalId2);
        if (!BonusbuttonFound) {
            console.log('Bonus Button not found, window closing in 5 sec');
            chrome.runtime.sendMessage({ type: "BonusButtonnotfound" });
            setTimeout(() => {
                window.close();
            }, 5000);
        }
    }, 15000);
    chrome.runtime.sendMessage({ type: "Done" });
}
function ButtonLogic() {
    let clickCount = 0;
    const Bonusbutton2 = document.querySelector("button[type='submit']");
    const clickInterval = setInterval(() => {
        if (clickCount < 10) {
            Bonusbutton2.click();
            console.log('Bonus Button clicked.');
            clickCount++;
        }
        else {
            clearInterval(clickInterval);
            console.log('Bonus Button clicked Done, window closing in 30 seconds');
            fetchNotification();
            setTimeout(() => {
              window.close();
          }, 35000);
        }
    }, 50);
}

function fetchNotification() {
    console.log('Fetching notification started');
    const checkNotificationExist = setInterval(function() {
        const notificationContainer = document.querySelector(".notification-body");
        if (notificationContainer) {
            console.log('Bonus Notification found');
            clearInterval(checkNotificationExist);
            const BonusnotificationText = notificationContainer.innerText.replace(/\s+/g, ' ').trim();
            chrome.runtime.sendMessage({ 
                type: "BonusNotificationFound", 
                data: BonusnotificationText 
            });
        }
    }, 1500);
}