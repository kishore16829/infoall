document.getElementById("careerQuiz").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = new FormData(this);

  const studentClass = form.get("class");
  const interest = form.get("interest");
  const work = form.get("work");
  const goal = form.get("goal");

  let resultHTML = "";
  let career = "";
  let advice = "";

  /* CAREER LOGIC */
  if (interest === "science" && work === "technical") {
    career = "Engineering / Technology";
    advice = "You have strong analytical skills. Focus on Maths, Physics, and competitive exams like JEE.";
  } 
  else if (interest === "biology" && work === "medical") {
    career = "Medical / Healthcare";
    advice = "You enjoy helping others. Biology-based careers like MBBS, Nursing, or Pharmacy suit you.";
  } 
  else if (interest === "commerce" && work === "management") {
    career = "Commerce & Business";
    advice = "You have a business mindset. Consider CA, BBA, MBA, or Entrepreneurship.";
  } 
  else if (interest === "arts" && work === "creative") {
    career = "Arts & Creative Fields";
    advice = "Your creativity is your strength. Careers in design, media, teaching, or social sciences fit well.";
  } 
  else {
    career = "Multi-disciplinary Career";
    advice = "You have flexible interests. Explore career counseling and skill-based courses.";
  }

  /* GOAL BASED SUGGESTION */
  let goalTip = "";
  if (goal === "highsalary") {
    goalTip = "Choose skill-oriented courses and focus on industry demand.";
  } else if (goal === "service") {
    goalTip = "Start preparing early for government exams like UPSC, SSC, or TNPSC.";
  } else if (goal === "business") {
    goalTip = "Learn finance, marketing, and real-world business skills.";
  } else {
    goalTip = "Follow your passion but also build strong core skills.";
  }

  /* FINAL RESULT HTML */
  resultHTML = `
    <h2>🎯 Career Suggestion</h2>
    <p><strong>Recommended Path:</strong> ${career}</p>
    <p>${advice}</p>
    <p><strong>Goal Tip:</strong> ${goalTip}</p>
    <p style="margin-top:12px;"><em>This result is based on your answers. Explore more options and guidance.</em></p>
  `;

  const resultBox = document.getElementById("result");
  resultBox.innerHTML = resultHTML;
  resultBox.style.display = "block";

  /* Smooth scroll to result */
  resultBox.scrollIntoView({ behavior: "smooth" });
});
