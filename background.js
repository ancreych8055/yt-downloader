// background.js
console.log('Background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background: Message received:', request);

    if (request.action === 'downloadAudio') {
        const videoUrl = request.url;
        console.log('Background: Download URL:', videoUrl);

        try {
            const port = chrome.runtime.connectNative('host');
            console.log('Background: Connected to host');

            port.onMessage.addListener((response) => {
                console.log('Background: Host response:', response);
                chrome.runtime.sendMessage({
                    type: 'downloadStatus',
                    status: response.status === 'success' ? 'completed' : 'error',
                    message: response.status === 'success' ? 'Download completed' : 'Error: ' + (response.message || response.output)
                });
                port.disconnect();
            });

            port.onDisconnect.addListener(() => {
                const error = chrome.runtime.lastError;
                if (error) {
                    console.error('Background: Host error:', error.message);
                    chrome.runtime.sendMessage({
                        type: 'downloadStatus',
                        status: 'error',
                        message: 'Host error: ' + error.message
                    });
                } else {
                    console.log('Background: Host connection closed');
                }
            });

            port.postMessage({ video_url: videoUrl });
            sendResponse({ status: 'ok' });

        } catch (e) {
            console.error('Background: Exception:', e);
            chrome.runtime.sendMessage({
                type: 'downloadStatus',
                status: 'error',
                message: 'Error: ' + e.message
            });
        }
    }
    return true;
});