import { useState } from "react";

function App() {
  const [message, setMessage] = useState("Ready");

  async function changePageColor() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab was found.");
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.body.style.backgroundColor = "#fff4c2";
        },
      });

      setMessage("Page color changed");
    } catch (error) {
      console.error(error);
      setMessage("This page cannot be modified");
    }
  }

  async function resetPageColor() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab was found.");
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.body.style.backgroundColor = "";
        },
      });

      setMessage("Page color reset");
    } catch (error) {
      console.error(error);
      setMessage("This page cannot be modified");
    }
  }

  return (
    <main className="popup">
      <h1>React Extension</h1>

      <p>{message}</p>

      <button type="button" className="bg-blue-400" onClick={changePageColor}>
        Change page color
      </button>

      <button type="button" className="bg-red-400" onClick={resetPageColor}>
        Reset page color
      </button>
    </main>
  );
}

export default App;
