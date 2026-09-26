const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("status");
const fileInput = document.getElementById("fileInput");
const attachBtn = document.getElementById("attachBtn");
const fileInfo = document.getElementById("fileInfo");

let messages = [];

function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();

    if (data.ok) {
      statusEl.textContent = "Online";
    } else {
      statusEl.textContent = "Offline";
    }
  } catch {
    statusEl.textContent = "Offline";
  }
}

async function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  addMessage("user", text);

  messages.push({
    role: "user",
    content: text
  });

  input.value = "";
  sendBtn.disabled = true;
  statusEl.textContent = "Thinking...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Something went wrong."
      );
    }

    addMessage("assistant", data.answer);

    messages.push({
      role: "assistant",
      content: data.answer
    });

    statusEl.textContent = "Online";

  } catch (error) {
    addMessage(
      "assistant",
      "Sorry, an error occurred: " + error.message
    );

    statusEl.textContent = "Error";
  }

  sendBtn.disabled = false;
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

attachBtn.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    fileInfo.textContent =
      "Selected: " + fileInput.files[0].name;
  }
});

checkHealth();
