const chatBox = document.getElementById("chat-box");
const optionsBox = document.getElementById("options-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const name = localStorage.getItem('userName') || 'वापरकर्ता';
const contact = localStorage.getItem('userContact') || '';

document.getElementById("user-info").innerText = `नाव: ${name} | संपर्क: ${contact}`;

let messages = [
  {
    role: "system",
    content: "तुम्ही एक संवेदनशील मानसिक आरोग्य सहाय्यक आहात. वापरकर्त्याला एकावेळी एक प्रश्न विचारा (मराठीत) आणि त्याला ४ पर्याय द्या. वापरकर्ता पर्याय क्रमांक उत्तर देईल. अंदाजे १५ प्रश्नांनंतर निष्कर्ष द्या."
  },
  {
    role: "user",
    content: "मूल्यमापन सुरू करा"
  }
];

function addMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = role;
  msg.innerText = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(text) {
  addMessage("user", text);
  messages.push({ role: "user", content: text });

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral:instruct",
      messages: messages
    })
  });

  const data = await res.json();
  const reply = data.choices[0].message.content;
  addMessage("assistant", reply);
  messages.push({ role: "assistant", content: reply });
}

sendBtn.onclick = () => {
  const input = userInput.value.trim();
  if (!input) return;
  userInput.value = "";
  sendMessage(input);
};
