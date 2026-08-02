document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup: DOM loaded');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusDiv = document.getElementById('status');

    if (!downloadBtn || !statusDiv) {
        console.error('Popup: Button or status div not found');
        return;
    }

    chrome.runtime.onMessage.addListener((message) => {
        console.log('Popup: Message from background:', message);
        if (message.type === 'downloadStatus') {
            if (message.status === 'completed') {
                statusDiv.innerText = message.message;
            } else if (message.status === 'error') {
                statusDiv.innerText = 'Error: ' + message.message;
            }
        }
    });

    downloadBtn.addEventListener('click', () => {
        console.log('Popup: Button clicked');
        statusDiv.innerText = 'Loading...';

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('Popup: Active tab:', tabs[0]?.url);
            if (!tabs || tabs.length === 0) {
                statusDiv.innerText = 'Error: No active tab';
                return;
            }

            const url = tabs[0].url;
            if (!url || (!url.includes('youtube.com/watch') && !url.includes('youtu.be/'))) {
                statusDiv.innerText = 'Error: Open a YouTube video';
                return;
            }

            console.log('Popup: Sending message to background:', { action: 'downloadAudio', url });
            chrome.runtime.sendMessage({ action: 'downloadAudio', url: url }, (response) => {
                console.log('Popup: Background response:', response);
                if (chrome.runtime.lastError) {
                    console.error('Popup: Send error:', chrome.runtime.lastError.message);
                    statusDiv.innerText = 'Error: ' + chrome.runtime.lastError.message;
                }
            });
        });
    });
});