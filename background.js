chrome.action.onClicked.addListener(() => {
  const bonusUrl = `https://stake.us/settings/offers?app=Bonus`;
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  chrome.tabs.create({ url: bonusUrl });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (changeInfo.status === 'complete' && (tab.url.includes('?bonus=') || tab.url.includes('?promo=')) && !tab.url.includes('app=Bonus')) {
    chrome.tabs.sendMessage(tabId, { type: "Bonus" });
    console.log('Message sent to Script-Bonus');
  }

  if ((changeInfo.status === 'complete' && (tab.url.includes('tab=reload')) && !tab.url.includes('redeemBonus'))) {
    chrome.tabs.sendMessage(tabId, { type: "Reload" });
    console.log('Message sent to Script-Reload');
  }
  if (changeInfo.status === 'complete' && tab.url.includes('tab=dailyBonus')) {
    chrome.tabs.sendMessage(tabId, { type: "Daily" });
    console.log('Message sent to Script-Daily');
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

      if (request.type === 'countdownContainer') {
        const {days, hours, minutes, seconds} = request;
        console.log(`Received countdown data: Day=${days}, Hour=${hours}, Min=${minutes}, Sec=${seconds}`);
      } else if (request.type === 'noCountdown') {
          console.log('No countdown found.');
      } else if (request.type === 'NotActiveCode') {
          console.log('Code is not active.');
      } else if (request.type === 'Buttonnotfound') {
          console.log('Reload Button not found.');
      } else if (request.type === 'Buttonfound') {
          console.log('Buton Found.');
      } else if (request.type === 'Done') {
          console.log('Injection working.');
      } else if (request.type === 'BonusButtonfound') {
        console.log('Bonus Button found.');
      } else if (request.type === 'BonusButtonnotfound') {
        console.log('Bonus Button not found. Closing window.');
      } else if (request.type === 'Reloadbuttonfound') {
        console.log('Reload Button found.');
      } else if (request.type === 'Countdownfound') {
        console.log('Countdown Found');
      }else if (request.type === 'CountDFoundandsentwinclosing') {
        console.log('CountDown Found, sent, Window closing');
      }else if (request.type === 'CountDFoundandsent') {
        console.log('Countdown Found and sent');
      }else if (request.type === 'CountDFound') {
        console.log('Countdown Found');
      }else if (request.type === 'FetchStarted') {
        console.log('Fetch Started');
      }else if (request.type === 'NoReloadwindowsClosingin5sec') {
        console.log('No Reload found, closing window in 5 sec');
      }else if (request.type === 'RBclickedandFetchstarted') {
        console.log('Button clicked and fetch start comment sent');
      }else if (request.type === 'RBclicked') {
        console.log('Button clicked');
      }else if (request.type === 'RBFoundActive') {
        console.log('Active button found');
      }else if (request.type === 'RBnotactiveandFetchstarted') {
        console.log('Button found, not active, Fetch will start');
      }else if (request.type === 'ReloadFound1') {
        console.log('Reload Found');
      }else if (request.type === 'timeAndDate') {
        const { time, date, date1 } = request.data;
        console.log(`Reload Expires at : ${time} ${date} ${date1}`);
      }else if (request.type === 'DcountdownContainer') {
        const {days, hours, minutes, seconds} = request;
        console.log(`Received Daily countdown data: Day=${days}, Hour=${hours}, Min=${minutes}, Sec=${seconds}`);
      }else if (request.type === 'DCountDFoundandsentwinclosing') {
        console.log('DCountDown Found, sent, Window closing');
      }else if (request.type === 'DCountDFoundandsent') {
        console.log('DCountdown Found and sent');
      }else if (request.type === 'DailyFetchStarted') {
        console.log('Daily Fetch Started');
      }else if (request.type === 'DailyFound1') {
        console.log('Daily Found');
      }else if (request.type === 'timeAndDate1') {
        const { time, date, date1 } = request.data;
        console.log(`Daily Expires at : ${time} ${date} ${date1}`);
      }
  }
);

function checkIfUrlIsOpen() {
  chrome.tabs.query({ url: "https://stake.us/settings/offers?app=Bonus" }, function(tabs) {
    if (tabs.length === 0) {
      // URL is not open, so open it in a new tab
      chrome.tabs.create({ url: "https://stake.us/settings/offers?app=Bonus" });
    }
  });
}

// Schedule the check every 1 minutes
setInterval(checkIfUrlIsOpen, 60000);


// This is the WebSocket connection to your server.
const ws = new WebSocket('ws://5.78.84.230:3000');

ws.onopen = function() {
  console.log('Connected to the WebSocket server.');
};
