import React, { useEffect, useState } from "react";
import Button from "./components/ui/button";
import "./App.css";

interface TabInfo {
  url?: string;
  title?: string;
}

function App() {
  const [info, setInfo] = useState<TabInfo>({});

  const getCurrentTabInfo = async (): Promise<TabInfo> => {
    return new Promise((resolve) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          resolve({
            url: tabs[0].url,
            title: tabs[0].title
          });
        } else {
          resolve({});
        }
      });
    });
  };

  useEffect(() => {
    getCurrentTabInfo().then(tabInfo => {
      if (tabInfo.url && tabInfo.title) {
        console.log('현재 탭 정보:', tabInfo);
        setInfo(tabInfo);
      } else {
        console.error('현재 탭 정보를 가져올 수 없습니다.');
      }
    });
  }, []);

  const handleCapture = () => {
    chrome.runtime.sendMessage({ action: "captureTab" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("메시지 전송 오류:", chrome.runtime.lastError);
        alert("캡처 실패: " + chrome.runtime.lastError.message);
      } else {
        console.log("캡처 요청을 보냈습니다. 응답:", response);
        if (response.status === "success") {
          // 데이터 URL을 Blob으로 변환
          fetch(response.dataUrl)
            .then(res => res.blob())
            .then(blob => {
              // Blob을 파일로 저장
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = 'screenshot.png';
              document.body.appendChild(a);
              a.click();
              URL.revokeObjectURL(url);
              alert(response.message);
            })
            .catch(error => {
              console.error("스크린샷 저장 중 오류 발생:", error);
              alert("스크린샷 저장 중 오류가 발생했습니다.");
            });
        } else {
          alert("캡처 실패: " + response.message);
        }
      }
    });
  };

  return (
    <div className="app-container p-4">
      <Button 
        onClick={handleCapture} 
        className="capture-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        Capture
      </Button>
      <p className="text-xs text-gray-300">
        {info.url}
      </p>
    </div>
  );
}

export default App;
