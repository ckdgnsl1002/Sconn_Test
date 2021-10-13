const TELNO_KEY = "TELNO";
const ITEMNO_KEY = "ITEMNO";
const PW_KEY = "PW";

const savedTelNo = localStorage.getItem(TELNO_KEY);
const savedItemNo = localStorage.getItem(ITEMNO_KEY);

const password = document.getElementById("112password-input");
const passwordInput = document.querySelector(".password_input");
const passwordEyes = passwordInput.querySelector(".fa-eye");
const passwordEyesSlash = passwordInput.querySelector(".fa-eye-slash");
const eyes = passwordInput.querySelector(".eyes");
const btn = document.querySelector("button");

const itemsRef = db.collection("상품정보");

function showPassword() {
  passwordEyes.classList.add("hidden");
  passwordEyesSlash.classList.remove("hidden");
  password.setAttribute("type", "text");
} //done
function hidePassword() {
  passwordEyes.classList.remove("hidden");
  passwordEyesSlash.classList.add("hidden");
  password.setAttribute("type", "password");
} //done
function handleEyes() {
  if (passwordEyes.classList.contains("hidden") == false) {
    showPassword();
  } else {
    hidePassword();
  }
} //done
function savePassword() {
  let pw = password.value;
  localStorage.setItem(PW_KEY, pw);
}
function handleConfirmBtn() {
  let pw;

  if (password.value == "") {
    alert("비밀번호를 입력해주세요.");
  } else {
    itemsRef
      .where("contact", "==", savedTelNo)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          pw = doc.data().password;
        });
      })
      .then(() => {
        if (pw == password.value) {
          savePassword();
          location.href = "/html/1.1.2.1.html";
        } else {
          alert("비밀번호를 정확히 입력해주세요.");
        }
      });
  }
} //done
function chkPW() {
  let reg = /^(?=.*?[a-zA-z])(?=.*?[0-9]).{8,}$/;
  let pw = password.value;

  if (false === reg.test(pw)) {
    alert("비밀번호는 8자 이상으로, 영문, 숫자를 모두 포함해야 합니다.");
  } else {
    handleConfirmBtn();
  }
}
function enterkey(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    // 엔터키가 눌렸을 때 실행할 내용
    chkPW();
  }
}
const page112 = document.querySelector(".page112");

function init() {
  page112.style.height = window.innerHeight;

  eyes.addEventListener("click", handleEyes);
  btn.addEventListener("click", chkPW);
  document.addEventListener("keydown", enterkey);
}
init();
