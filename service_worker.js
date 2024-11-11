import { closeCurrentTab, getCurrentHour } from "./helper.js";
const LATE_HOUR = 22;
const BLOCKED_SITE = "youtube.com"; // can be array of sites
let intervalId = null;

function startInterval() {
  debugger;
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (!activeTab) return; // after few seconds the tab is not active and active tab will be undefined
      const activeUrl = activeTab.url;
      const tabId = activeTab.id;
      const currentHour = getCurrentHour();
 
      const isLate = currentHour >= LATE_HOUR || currentHour <= 5;
      const isYoutube = activeUrl?.includes(BLOCKED_SITE);

      if (isLate && isYoutube) {
        closeCurrentTab(tabId);
      }
    });
  }, 60_000);
}

startInterval();

// event listeners
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, (tab) => {
    const currentHour = getCurrentHour();
    const isLate = currentHour >= LATE_HOUR || currentHour <= 5;
    if (tab && isLate) {
      const tabUrl = tab.url;
      if (tabUrl?.includes(BLOCKED_SITE)) {
        closeCurrentTab(tabId);
      }
    }
  });
});

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    const tabId = details.tabId;
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting tab information:",
          chrome.runtime.lastError
        );
        return;
      }

      const isCurrentTabActive = tab.active;
      const currentHour = getCurrentHour();
      const isLate = currentHour >= LATE_HOUR || currentHour <= 5;

      if (isLate && isCurrentTabActive && tab?.url?.includes(BLOCKED_SITE)) {
        closeCurrentTab(tabId);
      }
    });
  },
  { url: [{ urlMatches: BLOCKED_SITE }] }
);
