let Code = '';
let currentDomain;
currentDomain = window.location.hostname;

const handleMessage = function(message, sender, sendResponse) {
    // Check if the message contains the bonus code and additional data
    if (message.bonusCode8) {
        Code = message.bonusCode8;
        // Do something with the bonus code and additional data
        console.log("Code :", Code);
        injectBonus3Script(Code)
        // Send a response back to the background script
        sendResponse({ received: true });
    }
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(handleMessage);


function injectBonus3Script(Code) { // Receive bonusCode as a parameter
    const inputField = document.querySelector("#main-content > div > div:nth-child(2) > div > div > div > div.stack.x-flex-start.y-flex-start.gap-larger.padding-none.direction-horizontal.padding-left-auto.padding-top-auto.padding-bottom-auto.padding-right-auto.svelte-1cd1boi > div:nth-child(2) > div > div > div > section:nth-child(2) > div.section-content.svelte-vdd8ml > div > div > label > div > div > input");
    const submitButton = document.querySelector("#main-content > div > div:nth-child(2) > div > div > div > div.stack.x-flex-start.y-flex-start.gap-larger.padding-none.direction-horizontal.padding-left-auto.padding-top-auto.padding-bottom-auto.padding-right-auto.svelte-1cd1boi > div:nth-child(2) > div > div > div > section:nth-child(2) > div.section-footer.svelte-1uegh18 > button");

    if (!inputField) {
        console.log("Input field not found.");
        return; // Exit function if input field is not found
    }

    if (!submitButton) {
        console.log("Submit button not found.");
        return; // Exit function if submit button is not found
    }

    // Set the value of the input field
    inputField.value = Code;
    
    // Trigger input event manually
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Trigger click event on the submit button
    submitButton.removeAttribute("disabled");
    submitButton.click();
    injectBonusScript();
}

function injectBonusScript() {
    let intervalId2;
    let BonusbuttonFound = false;
    const findBonusButton = () => {
        const allButtons = document.querySelectorAll("button[type='submit']");
        const Bonusbutton = Array.from(allButtons).find(btn => !btn.disabled);
        
        if (Bonusbutton) {
            console.log('Active Bonus Button found');
            chrome.runtime.sendMessage({ type: "BonusButtonfound" });
            BonusbuttonFound = true;
            clearInterval(intervalId2);
            ButtonLogic(Bonusbutton); // Pass the found button to ButtonLogic
        }
    };
    
    findBonusButton();
    intervalId2 = setInterval(findBonusButton, 100);
    
    setTimeout(() => {
        clearInterval(intervalId2);
        if (!BonusbuttonFound) {
            console.log('Active Bonus Button not found, window closing in 5 sec');
            chrome.runtime.sendMessage({ type: "BonusButtonnotfound" });
            setTimeout(() => {
                window.location.replace(`https://stake.us/settings/offers?app=Bonus`);
            }, 2000);
        }
    }, 10000); // 100 ms * 80 times = 8000 ms
}

function ButtonLogic(Bonusbutton) {
    let clickCount = 0;
    const clickInterval = setInterval(() => {
        if (clickCount < 30 && !Bonusbutton.disabled) {
            Bonusbutton.click();
            console.log('Bonus Button clicked.');
            clickCount++;
        } else {
            clearInterval(clickInterval);
            fetchNotification();
            console.log('Bonus Button clicked Done, window closing in 40 seconds');
            setTimeout(() => {
                window.location.replace(`https://stake.us/settings/offers?app=Bonus`);
            }, 40000);
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
                data: "Code: " + Code + " - " + BonusnotificationText 
            });
            setTimeout(() => {
                window.location.replace(`https://stake.us/settings/offers?app=Bonus`);
            }, 4000);
        }
    }, 1500);
}
