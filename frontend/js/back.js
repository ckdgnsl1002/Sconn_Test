//뒤로가기
const back = document.querySelector("#back");

function goback() {
  window.history.back();
}

back.addEventListener("click", goback);
