const input = document.getElementById("input");
const output = document.getElementById("chat-history");
const sendBtn = document.getElementById("send-btn");

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
  return div;
}

async function send() {
  const message = input.value.trim();
  if (!message) return;

  // UI Updates
  input.value = "";
  sendBtn.disabled = true;
  appendMessage("user", message);

  // Create AI placeholder
  const aiMessageDiv = appendMessage("ai", "");
  aiMessageDiv.classList.add("cursor"); // Add typing cursor

  try {
    const response = await fetch("/", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const decoder = new TextDecoder();

    // IMPORTANT: Streaming Logic
    for await (const chunk of response.body) {
      const text = decoder.decode(chunk, { stream: true });
      aiMessageDiv.textContent += text;
      output.scrollTop = output.scrollHeight;
    }
  } catch (err) {
    aiMessageDiv.textContent += "\nError: Could not connect to server.";
    console.error(err);
  } finally {
    aiMessageDiv.classList.remove("cursor");
    sendBtn.disabled = false;
    input.focus();
  }
}

// Event Listeners
sendBtn.onclick = send;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
