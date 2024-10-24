chrome.runtime.onInstalled.addListener(() => {
  console.log("확장 프로그램이 설치되었습니다.");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('your-target-url')) {
    chrome.tabs.executeScript(tabId, { file: 'contentScript.js' }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('콘텐츠 스크립트 로드 실패:', chrome.runtime.lastError);
      } else {
        console.log('콘텐츠 스크립트 로드 성공');
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("메시지를 받았습니다:", request);
  if (request.action === "someAction") {
    // 적절한 처리
    sendResponse({ result: "success" });
  }
  return true;  // 비동기 응답을 위해 true를 반환
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("메시지를 받았습니다:", request);
//   if (request.action === "capture") {
//     // 캡처 로직
//     sendResponse({success: true});
//     console.log("캡처 요청을 받았습니다.");
//   }
//   return true;  // 비동기 응답을 위해 true를 반환
// });
