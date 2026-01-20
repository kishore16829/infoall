document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const userText = input.value.trim();
      addMessage("You", userText);
      input.value = "";

      setTimeout(() => {
        const aiReply = getAIReply(userText);
        addMessage("AI", aiReply);
      }, 600);
    }
  });

  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender === "AI" ? "ai-msg" : "user-msg";
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getAIReply(msg) {
    msg = msg.toLowerCase();

    /* ---------- LANGUAGE ---------- */
    if (msg.includes("tamil")) {
      return "நான் தமிழ் மற்றும் English இரண்டிலும் உதவ முடியும் 😊 கேள்வி கேளுங்கள்!";
    }

    /* ---------- TOP COLLEGES ---------- */
    if (msg.includes("top") && msg.includes("college")) {
      return `
🎓 இந்தியாவின் Top 10 Colleges:
1️⃣ IISc Bangalore  
2️⃣ IIT Madras  
3️⃣ IIT Bombay  
4️⃣ IIT Delhi  
5️⃣ Delhi University  
6️⃣ Anna University, Chennai  
7️⃣ Loyola College, Chennai  
8️⃣ St. Xavier’s College, Mumbai  
9️⃣ Presidency College, Chennai  
🔟 Madras Christian College (MCC)
`;
    }

    /* ---------- STREAM BASED ---------- */
    if (msg.includes("science") || msg.includes("engineering")) {
      return "🔬 Science / Engineering students should prefer colleges with strong labs, faculty, research exposure, and placements like IITs, IISc, and Anna University.";
    }

    if (msg.includes("commerce")) {
      return "📊 Commerce students should choose colleges with good accounting, finance, CA support, internships, and corporate exposure like Loyola, DU, and St. Xavier’s.";
    }

    if (msg.includes("arts")) {
      return "🎨 Arts colleges focus on communication, creativity, civil services, and research. Loyola, Presidency, and DU are excellent choices.";
    }

    /* ---------- CAREER HELP ---------- */
    if (msg.includes("career")) {
      return "💼 Choosing the right college depends on your interest, strengths, career goals, placements, and course quality. I can guide you step-by-step.";
    }

    /* ---------- DEFAULT ---------- */
    return "🤖 Ask me about top colleges, science, commerce, arts, or career guidance (Tamil / English supported).";
  }
});
