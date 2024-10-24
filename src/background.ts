export {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureTab") {
    chrome.windows.getCurrent(window => {
      if (window.id === undefined) {
        sendResponse({ status: "error", message: "현재 창을 찾을 수 없습니다." });
        return;
      }

      chrome.tabs.captureVisibleTab(
        window.id,
        { format: "png" },
        (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ status: "error", message: chrome.runtime.lastError.message });
          } else {
            // 데이터 URL을 그대로 반환
            sendResponse({ status: "success", message: "스크린샷이 캡처되었습니다.", dataUrl: dataUrl });
          }
        }
      );
    });

    return true; // 비동기 응답을 위해 true 반환
  }
});
