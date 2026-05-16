window.addEventListener("DOMContentLoaded", () => {

  const currentScript =
    document.currentScript;

  const businessId =
    currentScript?.getAttribute(
      "data-business"
    ) || "777luckydraws";

  let settings = null;

  // LOAD SETTINGS

  fetch(
    `http://localhost:3000/settings?businessId=${businessId}`
  )
  .then((response) => response.json())
  .then((data) => {

    settings = data;

    startWidget();

  });

  // START WIDGET

  function startWidget() {

    const widget =
      document.createElement("div");

    widget.innerHTML = `

<div id="chat-button">
  💬
</div>

<div id="chat-widget" class="closed">

  <!-- HEADER -->

  <div id="chat-header">

    <span>
      ${settings.business_name} AI
    </span>

    <button id="close-chat">
      ✕
    </button>

  </div>

  <!-- WELCOME -->

  <div id="welcome-screen">

    <div id="welcome-content">

      <h2>
        👋 Welcome
      </h2>

      <p>
        How can we help today?
      </p>

      <button id="start-chat">
        Start Conversation
      </button>

    </div>

  </div>

  <!-- CHAT -->

  <div id="chat-container">

    <div id="chat-messages">

      <div class="message ai">
        Hello 👋 How can I help you today?
      </div>

    </div>

    <!-- TYPING -->

    <div id="typing-indicator">
      AI is typing...
    </div>

    <!-- BOTTOM -->

    <div id="bottom-area">

      <div id="chat-input-area">

        <input
          id="chat-input"
          placeholder="Type message..."
        />

        <button id="chat-send">
          Send
        </button>

      </div>

      <div id="chat-footer">
        Powered by 777LuckyDrawsLTD
      </div>

    </div>

  </div>

</div>

<style>

#chat-button {

  position: fixed;

  bottom: 20px;
  right: 20px;

  width: 65px;
  height: 65px;

  border-radius: 50%;

  background:
    ${settings.primary_color};

  color: white;

  display: flex;

  justify-content: center;
  align-items: center;

  font-size: 28px;

  cursor: pointer;

  z-index: 999999;

  box-shadow:
    0 0 20px rgba(0,0,0,0.4);

  transition: 0.3s;

}

#chat-button:hover {

  transform: scale(1.08);

}

#chat-widget {

  position: fixed;

  bottom: 100px;
  right: 20px;

  width: 350px;
  height: 520px;

  background: #111827;

  border-radius: 20px;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  font-family: Arial;

  z-index: 999999;

  box-shadow:
    0 0 30px rgba(0,0,0,0.4);

}

#chat-widget.closed {

  display: none;

}

#chat-header {

  background:
    ${settings.primary_color};

  color: white;

  padding: 15px;

  font-weight: bold;

  display: flex;

  justify-content: space-between;
  align-items: center;

  flex-shrink: 0;

}

#close-chat {

  background: transparent;

  border: none;

  color: white;

  font-size: 18px;

  cursor: pointer;

}

#welcome-screen {

  flex: 1;

  display: flex;

  justify-content: center;
  align-items: center;

  text-align: center;

  padding: 30px;

  color: white;

}

#welcome-content h2 {

  margin-bottom: 10px;

}

#welcome-content p {

  margin-bottom: 20px;

  color: #d1d5db;

}

#start-chat {

  padding: 12px 20px;

  border: none;

  border-radius: 10px;

  background:
    ${settings.primary_color};

  color: white;

  cursor: pointer;

  font-weight: bold;

}

#chat-container {

  display: none;

  flex-direction: column;

  flex: 1;

  overflow: hidden;

  min-height: 0;

}

#chat-messages {

  flex: 1;

  overflow-y: auto;

  overflow-x: hidden;

  padding: 15px;

  color: white;

  display: flex;

  flex-direction: column;

  scroll-behavior: smooth;

  min-height: 0;

}

.message {

  margin-bottom: 10px;

  padding: 12px;

  border-radius: 12px;

  max-width: 85%;

  line-height: 1.4;

  word-wrap: break-word;

}

.user {

  background:
    ${settings.primary_color};

  margin-left: auto;

}

.ai {

  background: #374151;

}

#typing-indicator {

  display: none;

  padding: 0 15px 10px;

  font-size: 13px;

  color: #9ca3af;

}

#bottom-area {

  flex-shrink: 0;

  background: #1f2937;

}

#chat-input-area {

  display: flex;

  padding: 10px;

  gap: 10px;

}

#chat-input {

  flex: 1;

  padding: 12px;

  border: none;

  border-radius: 10px;

  background: #374151;

  color: white;

}

#chat-send {

  padding: 12px 15px;

  background:
    ${settings.primary_color};

  color: white;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  font-weight: bold;

}

#chat-send:hover {

  opacity: 0.9;

}

#chat-send:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}

#chat-footer {

  text-align: center;

  padding: 8px;

  font-size: 11px;

  color: #9ca3af;

  background: #0f172a;

}

@media (max-width: 600px) {

  #chat-widget {

    width: 100%;

    height: 100%;

    bottom: 0;
    right: 0;

    border-radius: 0;

  }

  #chat-button {

    width: 60px;
    height: 60px;

    bottom: 15px;
    right: 15px;

  }

  .message {

    max-width: 92%;

  }

}

</style>

`;

    document.body.appendChild(widget);

    // ELEMENTS

    const chatWidget =
      document.getElementById(
        "chat-widget"
      );

    const chatButton =
      document.getElementById(
        "chat-button"
      );

    const closeButton =
      document.getElementById(
        "close-chat"
      );

    const welcomeScreen =
      document.getElementById(
        "welcome-screen"
      );

    const chatContainer =
      document.getElementById(
        "chat-container"
      );

    const startChatButton =
      document.getElementById(
        "start-chat"
      );

    const messages =
      document.getElementById(
        "chat-messages"
      );

    const input =
      document.getElementById(
        "chat-input"
      );

    const button =
      document.getElementById(
        "chat-send"
      );

    const typingIndicator =
      document.getElementById(
        "typing-indicator"
      );

    // OPEN CHAT

    chatButton.onclick = () => {

      chatWidget.classList.remove(
        "closed"
      );

      chatButton.style.display =
        "none";

    };

    // CLOSE CHAT

    closeButton.onclick = () => {

      chatWidget.classList.add(
        "closed"
      );

      chatButton.style.display =
        "flex";

    };

    // START CHAT

    startChatButton.onclick = () => {

      welcomeScreen.style.display =
        "none";

      chatContainer.style.display =
        "flex";

    };

    // SEND MESSAGE

    async function sendMessage() {

      const message =
        input.value.trim();

      if (!message) return;

      messages.innerHTML += `

        <div class="message user">
          ${message}
        </div>

      `;

      input.value = "";

      button.disabled = true;

      typingIndicator.style.display =
        "block";

      setTimeout(() => {

        messages.scrollTop =
          messages.scrollHeight;

      }, 50);

      try {

        const response =
          await fetch(
            "http://localhost:3000/chat",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                message,

                businessId,

                userEmail:
                  settings.user_email

              })

            }
          );

        const data =
          await response.json();

        typingIndicator.style.display =
          "none";

        messages.innerHTML += `

          <div class="message ai">
            ${data.reply}
          </div>

        `;

        button.disabled = false;

        setTimeout(() => {

          messages.scrollTop =
            messages.scrollHeight;

        }, 50);

      } catch (error) {

        console.log(error);

        typingIndicator.style.display =
          "none";

        button.disabled = false;

      }

    }

    // BUTTON CLICK

    button.onclick =
      sendMessage;

    // ENTER KEY

    input.addEventListener(
      "keypress",
      (event) => {

        if (
          event.key === "Enter"
        ) {

          sendMessage();

        }

      }
    );

  }

});