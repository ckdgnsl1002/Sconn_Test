const goHomeBtn = document.getElementById("go-home");

function goHome() {
  location.href = "https://www.sconncurating.com";
}
const page121 = document.querySelector(".page121");

function init() {
  goHomeBtn.addEventListener("click", goHome);
}
init();
