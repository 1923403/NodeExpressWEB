document.querySelector("#a1").addEventListener("click", formularAnzeigen);

function formularAnzeigen() {
  let formular = document.querySelector(".formular");
  if (formular.style.display === "block") {
    formular.style.display = "none";
  } else {
    formular.style.display = "block";
  }
}
