document.getElementById("careerQuiz").addEventListener("submit", function (e) {
  e.preventDefault();

  const studentClass = document.querySelector('input[name="class"]:checked').value;
  const interest = document.querySelector('input[name="interest"]:checked').value;
  const work = document.querySelector('input[name="work"]:checked').value;

  let resultText = "";

  if (interest === "science" && work === "technical") {
    resultText = `
      <h2>Recommended Career: Engineering / Technology</h2>
      <p>Suitable for students who enjoy problem solving, maths, and technology.</p>
      <ul>
        <li>Courses: BTech, BSc Computer Science</li>
        <li>Exams: JEE, State Engineering Exams</li>
      </ul>
    `;
  } 
  else if (interest === "biology" && work === "medical") {
    resultText = `
      <h2>Recommended Career: Medical & Healthcare</h2>
      <p>Best for students interested in biology and helping people.</p>
      <ul>
        <li>Courses: MBBS, Nursing, BSc Allied Health</li>
        <li>Exams: NEET</li>
      </ul>
    `;
  } 
  else if (interest === "commerce" && work === "management") {
    resultText = `
      <h2>Recommended Career: Commerce & Business</h2>
      <p>Ideal for finance, business, and management-oriented students.</p>
      <ul>
        <li>Courses: BCom, BBA, CA, CS</li>
        <li>Careers: Accountant, Manager, Entrepreneur</li>
      </ul>
    `;
  } 
  else {
    resultText = `
      <h2>Recommended Career: Arts & Humanities</h2>
      <p>Perfect for creative thinkers and social-oriented students.</p>
      <ul>
        <li>Courses: BA, LLB, Journalism</li>
        <li>Careers: Civil Services, Teaching, Media</li>
      </ul>
    `;
  }

  document.getElementById("result").innerHTML = resultText;
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
});
