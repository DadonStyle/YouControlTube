export const closeCurrentTab = (tabId) => {
  setTimeout(() => {
    chrome.tabs.remove(tabId, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(`Tab with ID ${tabId} closed.`);
      }
    });
  }, 1_000);
};

export function getCurrentHour() {
  const options = {
    hour: "numeric",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return parseInt(formatter.format(new Date()), 10);
}
