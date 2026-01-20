// Simple button click effect
document.querySelector('.btn').addEventListener('click', () => {
    console.log("Button clicked! Redirecting...");
});
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("ai-input");
  const messages = document.getElementById("ai-messages");

  if (!input || !messages) {
    console.error("AI elements not found");
    return;
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const userMsg = input.value.trim();
      addMessage("You", userMsg);
      input.value = "";

      setTimeout(() => {
        addMessage("AI", getAIReply(userMsg));
      }, 600);
    }
  });

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msg.style.marginBottom = "8px";
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function getAIReply(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("10th")) return "📘 10th question papers & formulas are available on this website.";
    if (msg.includes("12th")) return "📗 12th study materials and PDFs are available here.";
    if (msg.includes("career")) return "🎯 Try the career quiz to find your best career option.";
    if (msg.includes("formula")) return "📄 Formula PDFs are available for download.";
    if (msg.includes("paper")) return "📝 Previous year question papers are available subject-wise.";

    return "🤖 I can help with exams, question papers, formulas, and careers.";
  }
});
