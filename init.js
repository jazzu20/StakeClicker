setTimeout(() => {
    document.getElementById('reload').checked = true;
    document.getElementById('daily').checked = true;
    document.getElementById('autoReconnect').checked = true;
    reloadCheckbox.dispatchEvent(new Event('change'));
    dailyCheckbox.dispatchEvent(new Event('change'));
    autoReconnectCheckbox.dispatchEvent(new Event('change'));
}, 1000);
