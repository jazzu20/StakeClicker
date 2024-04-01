let clickCount = 0;
const maxClicks = 150;
const clickInterval = setInterval(() => {
    const submitButton = document.querySelector("button[type='submit']");
    try {
        if (submitButton && clickCount < maxClicks) {
            submitButton.click();
            clickCount++;
            // Add a delay between clicks (e.g., 1000ms = 1 second)
            setTimeout(() => {
                console.log('Clicked button ', clickCount);
            }, 5000);
        } else {
            clearInterval(clickInterval);
            console.log('Clicked all submit buttons or reached maximum clicks.');
        }
    } catch (error) {
        console.error('Error clicking button:', error);
        // You can choose whether to reset clickCount or not here
        // clickCount = 0;
    }
}, 50);
