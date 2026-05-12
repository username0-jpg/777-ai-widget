(function () {

  const currentScript =
    document.currentScript;

  const businessId =
    currentScript.getAttribute(
      "data-business"
    ) || "777luckydraws";

  // CREATE CHAT BUTTON

  const button = document.createElement("div");

  button.innerHTML = "💬";

  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.width = "60px";
  button.style.height = "60px";
  button.style.background = "#dc2626";
  button.style.borderRadius = "50%";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.fontSize = "30px";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";
  button.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";

  document.body.appendChild(button);

  // CREATE CHAT WINDOW

  const chatWindow = document.createElement("div");

  chatWindow.style.position = "fixed";
  chatWindow.style.bottom = "90px";
  chatWindow.style.right = "20px";
  chatWindow.style.width = "350px";
  chatWindow.style.height = "500px";
  chatWindow.style.background = "#111827";
  chatWindow.style.borderRadius = "20px";
  chatWindow.style.display = "none";
  chatWindow.style.flexDirection = "column";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.zIndex = "9999";
  chatWindow.style.boxShadow = "0 0 30px rgba(0,0,0,0.4)";

  chatWindow.innerHTML = `

    <div style="
      background:#dc2626;
      color:white;
      padding:15px;
      font-weight:bold;
      font-size:18px;
    ">
      777 AI Assistant
    </div>

    <div id="chatMessages" style="
      flex:1;
      padding:15px;
      overflow-y:auto;
      color:white;
      display:flex;
      flex-direction:column;
      gap:10px;
    ">
      <div style="
        background:#374151;
        padding:10px;
        border-radius:10px;
        width:fit-content;
      ">
        Hello 👋 How can I help?
      </div>
    </div>

    <div style="
      display:flex;
      padding:10px;
      background:#1f2937;
    ">

      <input
        id="chatInput"
        placeholder="Type message..."
        style="
          flex:1;
          padding:10px;
          border:none;
          border-radius:10px;
          outline:none;
        "
      />

      <button
        id="sendBtn"
        style="
          margin-left:10px;
          background:#dc2626;
          color:white;
          border:none;
          border-radius:10px;
          padding:10px 15px;
          cursor:pointer;
        "
      >
        Send
      </button>

    </div>

  `;

  document.body.appendChild(chatWindow);

  // TOGGLE CHAT

  button.onclick = () => {

    if (chatWindow.style.display === "none") {

      chatWindow.style.display = "flex";

    } else {

      chatWindow.style.display = "none";

    }

  };

  // SEND MESSAGE

  async function sendMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value.trim();

    if (!message) return;

    const messages = document.getElementById("chatMessages");

    messages.innerHTML += `
      <div style="
        background:#2563eb;
        padding:10px;
        border-radius:10px;
        align-self:flex-end;
        width:fit-content;
        color:white;
      ">
        ${message}
      </div>
    `;

    input.value = "";

    const response = await fetch(
      "https://seven77-ai-backend.onrender.com/chat",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  message: message,
  businessId: businessId
})

      }
    );

    const data = await response.json();

    messages.innerHTML += `
      <div style="
        background:#374151;
        padding:10px;
        border-radius:10px;
        width:fit-content;
        color:white;
      ">
        ${data.reply}
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;

  }

  document
  .getElementById("chatInput")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

      sendMessage();

    }

  });
})();