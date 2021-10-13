const TELNO_KEY = "TELNO";

const goHomeBtn = document.getElementById("go-home");
function goHome() {
  localStorage.removeItem(TELNO_KEY);
  location.href = "https://www.sconncurating.com";
}
const page1411 = document.querySelector(".page1411");

function init() {
  goHomeBtn.addEventListener("click", goHome);
}
init();
