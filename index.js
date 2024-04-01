let ws = null;
let connectionStatus;
let messages;
let viewMessage;
let connectButton;
let disconnectButton;
let disconnectInterval;
let bonusCode8;

const MAX_LINES_COUNT = 1000;
const SERVER_URL = 'ws://5.78.84.230:3000';
const cryptoSelector = $('#cryptoSelector');
const reloadCheckbox = document.getElementById('reload');
const countdownTimer = document.getElementById('countdownTimer');
const dailyCheckbox = document.getElementById('daily');
const DcountdownTimer = document.getElementById('DcountdownTimer');
const autoReconnectCheckbox = document.getElementById('autoReconnect');

let reloadInterval;
let dailyInterval;
let publicIP;

function fetchPublicIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        publicIP = data.ip;
        console.log('Public IP address:', publicIP);
        chrome.storage.local.set({ 'publicIP': publicIP }, function() {
          console.log('Public IP address stored:', publicIP);
        });
      })
      .catch(error => {
        console.error('Error fetching public IP:', error);
      });
}
fetchPublicIP();

function openReloadUrl() {
    const selectedCrypto = cryptoSelector.val();
    const reloadUrl = `https://stake.us/?tab=reload&modal=vip&currency=${selectedCrypto}`;
    window.open(reloadUrl, '_blank');
}

function openDailyUrl() {
    const dailyUrl = `https://stake.us/?tab=dailyBonus&currency=btc&modal=wallet`;
    window.open(dailyUrl, '_blank');
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'countdownContainer') {
        clearInterval(reloadInterval);
        const { days, hours, minutes, seconds } = request;
        // Start countdown
        startCountdown(hours, minutes, seconds);
    } else if (request.type === 'NoReloadwindowsClosingin5sec') {
        countdownTimer.textContent = 'No Active Reload';
        stopReload();
        reloadCheckbox.checked = false;
    } else if (request.type === 'ReloadFinished') {
        const { time, date } = request.data; // Destructure time and date from request data
        const currentTime = new Date();
        const [hourss, minutess] = time.split(':').map(str => parseInt(str));
        const [dayss, month, year] = date.split('.').map(str => parseInt(str));
        const reloadTime = new Date(year, month - 1, dayss, hourss, minutess); // month is 0-based index, hence month - 1
        
        // Check if reload time is later than current time
        if (reloadTime > currentTime) {
            reloadCheckbox.checked = false;
            reloadCheckbox.checked = true;
        } else {
            countdownTimer.textContent = 'Your Reload Finished';
            stopReload();
            reloadCheckbox.checked = false;
        }
    } else if (request.type === 'timeAndDate') {
        const { time, date, date1 } = request.data;
        const formattedDate1 = date1 !== undefined ? date1 : ""; // Check if date1 is undefined
    }
});

function startCountdown(hours, minutes, seconds) {
    // Clear any existing timeout

    const now = new Date().getTime();
    const countdownTime = now + hours*60*60*1000 + minutes*60*1000 + seconds*1000;
    const countDownDate = new Date(countdownTime);
    nextReloadTime = countDownDate.toLocaleTimeString();
    countdownTimer.textContent = `Next Reload at: ⏱ ${nextReloadTime}`;

    const worker = new Worker('workerR.js');

    worker.onmessage = function(event) {
        // Handle the countdown end event
        if (event.data === 'countdownREnded') {
            openReloadUrl();
        }
    };
    worker.onerror = function(error) {
        console.error('Error in worker:', error);
    };
    worker.postMessage({hours, minutes, seconds});
}

// Variable to keep track of the last message and its timestamp
let lastMessage = null;
let lastMessageTimestamp = 0;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Check the message type
    if (message.type === "DailyNotificationFound" || message.type === "ReloadNotificationFound" || message.type === "BonusNotificationFound") {
        // Get the current time
        const currentTime = new Date().getTime();

        // Check if the message data is the same as the last message
        if (JSON.stringify(message.data) === JSON.stringify(lastMessage)) {
            // Check if it has been less than 5 seconds since the last message
            if (currentTime - lastMessageTimestamp < 4000) {
                // Ignore the message
                return;
            }
        }
        // Call NotificationMessages function with the message data
        if (message.type === "DailyNotificationFound") {
            // Call NotificationMessages function with notification text
            addMessage("📣 Daily: " + message.data);
        } else if (message.type === "ReloadNotificationFound") {
            // Call NotificationMessages function with bonus notification text
            addMessage("📣 Reload: " + message.data);
        } else if (message.type === "BonusNotificationFound") {
            // Call NotificationMessages function with bonus notification text
            addMessage("📣 Bonus: " + message.data);
        }
        // Update the last message and its timestamp
        lastMessage = message.data;
        lastMessageTimestamp = currentTime;
    }
});



// Function to handle messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'DcountdownContainer') {
        clearInterval(dailyInterval);
        const { days, hours, minutes, seconds } = request;
        // Start countdown
        startCountdown1(hours, minutes, seconds);
    } else if (request.type === 'DailyFinished') {
        const { time, date } = request.data; // Destructure time and date from request data
        const currentTime = new Date();
        const [hourss, minutess] = time.split(':').map(str => parseInt(str));
        const [dayss, month, year] = date.split('.').map(str => parseInt(str));
        const reloadTime = new Date(year, month - 1, dayss, hourss, minutess); // month is 0-based index, hence month - 1
        
        // Check if reload time is later than current time
        if (reloadTime > currentTime) {
            dailyCheckbox.checked = false;
            dailyCheckbox.checked = true;
        } else {
            DcountdownTimer.textContent = 'Your Daily Finished';
            stopReload();
            dailyCheckbox.checked = false;
        }
    } else if (request.type === 'timeAndDate1') {
        const { time, date, date1 } = request.data;
        const formattedDate1 = date1 !== undefined ? date1 : ""; // Check if date1 is undefined
    }
});




function startCountdown1(hours, minutes, seconds) {
    // Clear any existing timeout

    const now = new Date().getTime();
    const DcountdownTime = now + hours*60*60*1000 + minutes*60*1000 + seconds*1000;
    const DcountDownDate = new Date(DcountdownTime);
    nextDailyTime = DcountDownDate.toLocaleTimeString();
    DcountdownTimer.textContent = `Next Daily at: ⏱ ${nextDailyTime}`;

    const worker = new Worker('workerD.js');

    worker.onmessage = function(event) {
        // Handle the countdown end event
        if (event.data === 'countdownDEnded') {
            openDailyUrl();
        }
    };
    worker.onerror = function(error) {
        console.error('Error in worker:', error);
    };
    worker.postMessage({hours, minutes, seconds});
}


// Function to stop reload interval
function stopReload() {
    clearInterval(reloadInterval);
}

function stopDaily() {
    clearInterval(dailyInterval);
}

// Event listener for checkbox change
reloadCheckbox.addEventListener('change', function() {
    if (this.checked) {
        openReloadUrl();
    } else {
        stopReload();
    }
});

autoReconnectCheckbox.addEventListener('change', function() {
    if (this.checked) {

        // Start monitoring connection status
        const monitorInterval = setInterval(() => {
            if (connectionStatus.text() === 'Disconnected') {
                // Try to connect every 2 seconds until connection status turns to "Connected"
                open();
            }
        }, 2000);

        // Once the checkbox is unchecked, stop the monitoring interval
        this.addEventListener('change', function() {
            if (!this.checked) {
                clearInterval(monitorInterval);
                // Enable the Connect-Disconnect button
            }
        });
    } else {
        // If the checkbox is unchecked, enable the button immediately
        connectButton.prop('disabled', false);
        disconnectButton.prop('disabled', false);
    }
});


// Event listener for checkbox change
dailyCheckbox.addEventListener('change', function() {
    if (this.checked) {
        openDailyUrl();
    } else {
        stopDaily();
    }
});

const disconnectAndReconnect = () => {
    clearLog(); // Clear messages log
    close(); // Disconnect
    setTimeout(() => {
        connectButton.click();
    }, 1000);
};

const startDisconnectInterval = () => {
    disconnectInterval = setInterval(disconnectAndReconnect, 7200000); // 2 hours in milliseconds
};

const stopDisconnectInterval = () => {
    clearInterval(disconnectInterval);
};

const JSONColorScheme = {
    keyColor: 'black',
    numberColor: 'blue',
    stringColor: 'green',
    trueColor: 'firebrick',
    falseColor: 'firebrick',
    nullColor: 'gray',
};

const getUrl = function () {
    return SERVER_URL;
};

const getNowDateStr = function () {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const enableConnectButton = function () {
    connectButton.text('Connect');
    connectButton.prop('disabled', false);
    disconnectButton.prop('disabled', true);
};

const disableConnectButton = function () {
    connectButton.text('Connecting...');
    connectButton.prop('disabled', true);
    disconnectButton.prop('disabled', false);
};


const wsIsAlive = function () {
    return (typeof (ws) === 'object'
        && ws !== null
        && 'readyState' in ws
        && ws.readyState === ws.OPEN
    );
};

const onOpen = function () {
    console.log(`Connected: ${getUrl()}`);
    connectionStatus.css('color', '#00ff3c');
    connectionStatus.text(`Connected`);
    connectButton.text('Disconnect');
    disconnectButton.prop('disabled', false);
    connectButton.prop('disabled', false);
    stopDisconnectInterval();
};

const onClose = function () {
    ws = null;
    enableConnectButton(); // Call the function to enable the connect button
    connectionStatus.text('Disconnected');
    connectButton.text('Connect'); // Change the button text back to "Connect"
    disconnectButton.prop('disabled', true); // Disable the disconnect button
};

const onMessage = function (event) {
    let data = event.data;
    let data1;
    console.log('Received data:', data); // Log the received data for debugging

    // Check if the received message is "Connected"
    if (data === 'Connected') {
        console.log('Connected'); // Log that connection is established
        addMessage(data);
        return; // Exit the function as we don't need to process further
    }

    if (data.startsWith('Link: ')) {
        // Extract the link and open it in a new window
        const link = data.substring(6); // Remove 'Link: ' prefix
        addMessage(data);
        window.open(link, '_blank');
        return; // Exit the function as we don't need to process further
    }

    data1 = `Code: ${data}`;
    addMessage(data1);

    bonusCode8 = data
    if (bonusCode8) {
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(tab => {
                try {
                    chrome.tabs.sendMessage(tab.id, { bonusCode8 });
                } catch (error) {
                    console.error('Error sending message to tab:', error);
                }
            });
        });
    } else {
        console.log('Bonus code not available.');
    }

};

const onError = function (event) {
    if (event.data !== undefined) {
        console.error(`ERROR: ${event.data}`);
    }
    close();
};

const open = function () {
    const url = getUrl();
    ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
    ws.onerror = onError;

    connectionStatus.css('color', '#d9ff00');
    connectionStatus.text('Connecting ...');
    disableConnectButton();

    startDisconnectInterval(); // Start the interval when the connection is established
};

const clearLog = function () {
    messages.html('');
    viewMessage.html('');
};

const connectButtonOnClick = function () {
    if (wsIsAlive()) {
        close();
    } else {
        open();
    }
};

const addMessage = function (message) {
    const msg = $('<pre>').text(`[${getNowDateStr()}] ${message}`);
    $('#messages').append(msg);
};

const close = function () {
    if (ws) {
        ws.close();
    }
    connectionStatus.css('color', '#ff0000');
    connectionStatus.text('Disconnected');
    console.log(`Disconnected: ${getUrl()}`);

    disableConnectButton();

    stopDisconnectInterval(); // Stop the interval when manually closing the connection
};

$(() => {
    connectionStatus = $('#connectionStatus');
    connectButton = $('#connectButton');
    disconnectButton = $('#disconnectButton');
    messages = $('#messages');
    viewMessage = $('#viewMessage');

    connectButton.click(connectButtonOnClick);
    disconnectButton.click(close);
});
