function searchPapers() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let items = document.querySelectorAll(".paper-item");

  items.forEach(item => {
    let text = item.innerText.toLowerCase();
    if (text.includes(input)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

