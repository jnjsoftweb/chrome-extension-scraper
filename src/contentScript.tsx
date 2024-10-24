console.log("콘텐츠 스크립트가 로드되었습니다.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("콘텐츠 스크립트가 메시지를 받았습니다:", request);
  if (request.action === "capture") {
    // 캡처 로직을 여기에 구현하세요
    sendResponse({ success: true, message: "캡처 완료" });
  }
  return true;  // 비동기 응답을 위해 true를 반환
});

export {};
