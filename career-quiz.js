document.getElementById("careerQuiz").addEventListener("submit", function (e) {
  e.preventDefault();

  // Career scores
  let scores = {
    engineering: 0,
    medical: 0,
    commerce: 0,
    arts: 0
  };

  // Collect all selected answers
  const answers = document.querySelectorAll("input[type='radio']:checked");

  answers.forEach(answer => {
    const value = answer.value;

    if (value === "engineering") scores.engineering += 10;
    if (value === "medical") scores.medical += 10;
    if (value === "commerce") scores.commerce += 10;
    if (value === "arts") scores.arts += 10;
  });

  const total = scores.engineering + scores.medical + scores.commerce + scores.arts;

  // Calculate percentage
  const percent = {};
  for (let career in scores) {
    percent[career] = total === 0 ? 0 : Math.round((scores[career] / total) * 100);
  }

  // Find best match
  const bestCareer = Object.keys(percent).reduce((a, b) =>
    percent[a] > percent[b] ? a : b
  );

  // Career descriptions
  const careerInfo = {
    engineering: "You enjoy problem-solving, technology, and innovation.",
    medical: "You like helping people and are interested in biology and healthcare.",
    commerce: "You have a business mindset and leadership qualities.",
    arts: "You are creative and expressive with strong imagination."
  };

  // Result HTML
  const resultHTML = `
    <h2>🎯 Career Match Result</h2>
    <p><strong>Best Career Match:</strong> ${bestCareer.toUpperCase()}</p>
    <p>${careerInfo[bestCareer]}</p>

    <h3>📊 Career Match Percentage</h3>
    <ul>
      <li>Engineering: ${percent.engineering}%</li>
      <li>Medical: ${percent.medical}%</li>
      <li>Commerce: ${percent.commerce}%</li>
      <li>Arts: ${percent.arts}%</li>
    </ul>

    <p><em>This result is based on your answers. Explore more guidance before final decisions.</em></p>
  `;

  const resultBox = document.getElementById("result");
  resultBox.innerHTML = resultHTML;
  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth" });
});
