
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messagesBox = document.getElementById("messages");
const sendButton = document.getElementById("send");

const history = [];

function addMessage(role, content) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  // textContent prevents model/user text from being interpreted as HTML.
  bubble.textContent = content;
  messagesBox.appendChild(bubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;
  return bubble;
}

async function sendMessage(text) {
  const question = text.trim();
  if (!question || sendButton.disabled) return;

  addMessage("user", question);
  history.push({ role: "user", content: question });

  input.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "…";

  const waiting = addMessage("assistant", "Soch raha hoon… / Thinking…");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-10) })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not get a response.");
    }

    waiting.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    waiting.textContent =
      "Maaf kijiye, abhi response nahi mil paaya. Please try again in a moment.";
    // Remove the unanswered user message from conversation history
    // so the next attempt does not send a misleading incomplete turn.
    history.pop();
    console.error("Smart Yatra request failed:", error.message);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send ➤";
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.question);
  });
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
