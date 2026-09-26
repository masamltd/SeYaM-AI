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

  div.className = "message " + role;
  div.textContent = content;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(text) {
  statusEl.textContent = text;
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

  setStatus("Thinking...");

  /*
   * GitHub Pages is a static website.
   * There is currently no backend/API endpoint connected.
   */

  setTimeout(() => {
    const reply =
      "আমি SeYaM AI-এর interface হিসেবে কাজ করছি। 🤖\n\n" +
      "তোমার message পেয়েছি: " + text +
      "\n\n" +
      "AI backend এখনো connect করা হয়নি।";

    addMessage("assistant", reply);

    messages.push({
      role: "assistant",
      content: reply
    });

    setStatus("Online");
    sendBtn.disabled = false;
  }, 600);
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

attachBtn.addEventListener("click", function() {
  fileInput.click();
});

fileInput.addEventListener("change", function() {
  if (!fileInput.files.length) return;

  const file = fileInput.files[0];

  fileInfo.textContent =
    "Selected: " + file.name;
});

setStatus("Online");
