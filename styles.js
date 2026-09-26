* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  font-family: Arial, sans-serif;
  background: #070b12;
  color: #ffffff;
}

body {
  min-height: 100vh;
}

.app {
  width: 100%;
  max-width: 1000px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #0b1019;
}

.topbar {
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: #111827;
  border-bottom: 1px solid #263044;
}

.topbar h1 {
  margin: 0;
  font-size: 25px;
}

.topbar p {
  margin: 5px 0 0;
  color: #9aa6b8;
  font-size: 14px;
}

#status {
  color: #4ade80;
  font-size: 13px;
  white-space: nowrap;
}

#chat {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  width: fit-content;
  max-width: 85%;
  margin-bottom: 15px;
  padding: 13px 16px;
  border-radius: 15px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message.user {
  margin-left: auto;
  background: #2563eb;
}

.message.assistant {
  margin-right: auto;
  background: #172033;
  border: 1px solid #29364d;
}

.composer {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #111827;
  border-top: 1px solid #263044;
}

#messageInput {
  flex: 1;
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid #334155;
  border-radius: 12px;
  outline: none;
  background: #070b12;
  color: #ffffff;
  font-size: 15px;
}

#messageInput:focus {
  border-color: #2563eb;
}

button {
  min-height: 44px;
  border: 0;
  border-radius: 11px;
  padding: 0 15px;
  background: #2563eb;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#attachBtn {
  width: 44px;
  padding: 0;
  background: #1e293b;
  font-size: 18px;
}

#fileInfo {
  padding: 0 15px 10px;
  background: #111827;
  color: #94a3b8;
  font-size: 13px;
}

@media (max-width: 600px) {
  .topbar {
    padding: 15px;
  }

  .topbar h1 {
    font-size: 21px;
  }

  #chat {
    padding: 14px;
  }

  .message {
    max-width: 92%;
  }

  .composer {
    padding: 9px;
  }

  #messageInput {
    font-size: 14px;
  }

  button {
    padding: 0 12px;
  }
    }
