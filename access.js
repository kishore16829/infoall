function searchPapers() {
  let input = document.getElementById("search").value.toLowerCase();
  let papers = document.querySelectorAll(".paper");

  papers.forEach(paper => {
    paper.style.display = paper.innerText.toLowerCase().includes(input) ? "block" : "none";
  });
}

function filterClass() {
  let value = document.getElementById("filter").value;
  let papers = document.querySelectorAll(".paper");

  papers.forEach(paper => {
    if (value === "all" || paper.classList.contains(value)) {
      paper.style.display = "block";
    } else {
      paper.style.display = "none";
    }
  });
}
