let launchButton = document.getElementById('launch');

launchButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: `
var scriptTag = document.createElement('script');
var cacheBreaker = (+(new Date()));
scriptTag.src = 'https://dobbsworks.github.io/Tools/Streambot/StreamHelper.js?q=' + cacheBreaker;
document.body.appendChild(scriptTag);
            ` });
    });
};